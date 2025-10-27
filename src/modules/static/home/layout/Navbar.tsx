"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getToken, removeToken } from "@/services/tokenService";
import { motion, useScroll, useTransform } from "framer-motion";
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
  { name: "Dashboard", href: "/teacher/dashboard/teacher" },
  { name: "Posts", href: "/teacher/dashboard/posts" },
  { name: "Messages", href: "/teacher/dashboard/messages" },
  { name: "Profile", href: "/teacher/dashboard/profile" },
  { name: "Announcements", href: "/teacher/dashboard/announcements" },
];

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
        sticky top-0 z-50 w-full px-4
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
      <div className="w-full px-4 relative">
        <div className="flex items-center justify-between h-16 sm:mt-6 2xl:mt-10">
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
                        hover:text-blue-600 
                        text-base font-medium transition-all duration-300
                        relative inline-block pb-1
                        before:content-[''] before:absolute before:bottom-0 before:left-0 
                        before:w-0 before:h-0.5 before:bg-blue-600 
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
                    flex items-center gap-2
                    bg-red-500 text-white px-6 py-3.5 rounded-full 
                    font-medium hover:bg-red-600 transition-colors
                  "
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="
                    flex items-center gap-2
                    text-gray-700 
                    hover:text-blue-600 px-6 py-3.5 text-base font-medium 
                    transition-colors border border-gray-400/50 
                    rounded-full hover:border-blue-600 backdrop-blur-md
                  "
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="
                    flex items-center gap-2
                    bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5
                    rounded-full text-base font-medium transition-colors
                  "
                >
                  <UserPlus className="w-5 h-5" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 ">
              <svg className="h-6 w-6" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
