"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getToken, removeToken } from "@/services/tokenService";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { queryClient } from "@/lib/queryClient";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, LogOut } from "lucide-react";

const publicNavigationLinks = [
  { name: "About", href: "/about" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "FAQ", href: "/faqs" },
  { name: "Contact", href: "/contact" },
];

const loggedInNavigationLinks = [
  { name: "Dashboard", href: "/dashboard/teacher" },
  { name: "Moderate", href: "/dashboard/teacher/grading" },
  { name: "My Posts", href: "/dashboard/teacher/posts" },
  { name: "Messages", href: "/dashboard/teacher/messages" },
  { name: "Profile", href: "/dashboard/teacher/profile" },
  { name: "Announcements", href: "/dashboard/teacher/announcements" },
];

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    queryClient.clear();
    removeToken();
    router.push("/auth/login");
  };

  const { scrollYProgress } = useScroll();
  const blurLevel = useTransform(scrollYProgress, [0, 0.1], ["0px", "20px"]);
  const navOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.85]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 0.1]);

  if (isLoading) return null;

  return (
    <motion.nav
      style={{
        backdropFilter: blurLevel,
        opacity: navOpacity,
        boxShadow: `0 4px 6px -1px rgb(0 0 0 / ${shadowOpacity})`,
      }}
      className="
        sticky top-0 z-50 w-full px-4 py-5 md:py-5
        bg-white/70
        transition-all duration-500 ease-in-out
        backdrop-blur-md
      "
    >
      {/* Bottom Border */}
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"
      />
      <div className="w-full px-2 sm:px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* Left Side */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo/logo-4.png"
                alt="Moderate Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Links */}
            <div className="hidden md:flex gap-6">
              {(isLoggedIn
                ? loggedInNavigationLinks
                : publicNavigationLinks
              ).map((link) => (
                <div key={link.name} className="relative">
                  <Link
                    href={link.href}
                    className="
                        text-gray-700 
                        hover:text-[#2997F1] 
                        text-base font-medium transition-all duration-300
                        relative inline-block pb-1
                        before:content-[''] before:absolute before:bottom-0 before:left-0 
                        before:w-0 before:h-0.5 before:bg-[#2997F1] 
                        hover:before:w-full before:transition-all before:duration-300 before:ease-in-out
                      "
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className="
                    group flex items-center gap-1.5 relative overflow-hidden
                    bg-red-500 text-white px-4 py-2 rounded-full 
                    text-sm font-medium transition-all duration-300 
                    hover:bg-red-600 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50
                    transform hover:-translate-y-0.5 active:scale-95
                  "
                >
                  <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span className="relative z-10">Logout</span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="
                    group flex items-center gap-2 relative
                    text-gray-700 
                    hover:text-[#2997F1] px-6 py-3.5 text-base font-medium 
                    transition-all duration-300 border border-gray-400/50 
                    rounded-full hover:border-[#2997F1] backdrop-blur-md
                    hover:bg-blue-50 hover:scale-105 hover:shadow-md
                    transform hover:-translate-y-0.5 active:scale-95
                  "
                >
                  <LogIn className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="
                    group flex items-center gap-2 relative overflow-hidden
                    bg-[#2997F1] hover:bg-[#2178c9] text-white px-6 py-3.5
                    rounded-full text-base font-medium transition-all duration-300
                    hover:scale-110 hover:shadow-xl hover:shadow-[#2997F1]/50
                    transform hover:-translate-y-1 hover:rotate-1 active:scale-100
                  "
                >
                  <UserPlus className="w-5 h-5 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <span className="relative z-10">Register</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.svg
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Outside the padded container for full width */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 right-0 w-full bg-white/80 border-t border-white/20 shadow-2xl py-6 px-4 z-50"
          >
            <div
              className="flex flex-col gap-2 backdrop-blur-2xl w-full h-screen"
              style={{
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
              }}
            >
              {/* Mobile Links */}
              {(isLoggedIn
                ? loggedInNavigationLinks
                : publicNavigationLinks
              ).map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-700 hover:text-[#2997F1] hover:bg-blue-50 text-base font-medium py-3 px-4 rounded-lg transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Buttons */}
              <div className="pt-2 mt-2 border-t border-gray-200 flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.3 }}
                    >
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex text-gray-700 hover:text-[#2997F1] hover:bg-blue-50 px-4 py-3 text-base font-medium transition-all duration-200 border-2 border-gray-200 hover:border-[#2997F1] rounded-lg items-center justify-center gap-2"
                      >
                        <LogIn className="w-4 h-4" />
                        Login
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.3 }}
                    >
                      <Link
                        href="/auth/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex bg-[#2997F1] hover:bg-[#2178c9] text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 items-center justify-center gap-2 shadow-lg shadow-[#2997F1]/30"
                      >
                        <UserPlus className="w-4 h-4" />
                        Register
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
