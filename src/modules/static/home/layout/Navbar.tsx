"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getToken, removeToken } from "@/services/tokenService";
import { motion, useScroll, useTransform } from "framer-motion";
import { queryClient } from "@/lib/queryClient";
import { useRouter } from "next/navigation";

const publicNavigationLinks = [
  { name: "About", href: "/about" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "FAQ", href: "/faqs" },
  { name: "Contact", href: "/contact" },
];

const loggedInNavigationLinks = [
  { name: "Dashboard", href: "/dashboard/teacher" },
  { name: "My Classes", href: "/dashboard/classes" },
  { name: "Uploads", href: "/dashboard/uploads" },
  { name: "Grading History", href: "/dashboard/grades" },
  { name: "Profile", href: "/profile" },
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
  const blurLevel = useTransform(scrollYProgress, [0, 0.1], ["0px", "18px"]);
  const navOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.82]);

  if (isLoading) return null;

  return (
    <motion.nav
      style={{ backdropFilter: blurLevel, opacity: navOpacity }}
      className="
        sticky top-0 z-50 w-full px-4
        
        transition-all duration-500 ease-in-out
        backdrop-blur-md shadow-sm
      "
    >
      <div className="w-full px-4">
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
                <motion.div
                  key={link.name}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Link
                    href={link.href}
                    className="
                        text-gray-700 
                        hover:text-blue-600 
                        text-base font-medium transition-colors
                      "
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard/teacher"
                  className="
                    text-gray-700  hover:text-blue-600 
                    px-6 py-3.5 text-base font-medium transition-colors 
                    border border-transparent rounded-full
                    backdrop-blur-md bg-white/10 
                    hover:bg-blue-100 
                  "
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="
                    bg-red-500 text-white px-6 py-3.5 rounded-full 
                    font-medium hover:bg-red-600 transition-colors
                  "
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="
                    text-gray-700 
                    hover:text-blue-600 px-6 py-3.5 text-base font-medium 
                    transition-colors border border-gray-400/50 
                    rounded-full hover:border-blue-600 backdrop-blur-md
                  "
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="
                    bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5
                    rounded-full text-base font-medium transition-colors
                  "
                >
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
