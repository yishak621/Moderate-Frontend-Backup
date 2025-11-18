"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getToken, getRole } from "@/services/tokenService";
import { performLogout } from "@/services/logoutService";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, LogOut, User, Shield, Bell } from "lucide-react";
import { useUserData } from "@/hooks/useUser";
import PopupCard from "@/components/PopCard";
import UserAvatar from "@/components/UserAvatar";
import NotificationBellWithPanel from "@/components/NotificationBellWithPanel";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

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
  { name: "Plans", href: "/pricing" },
];

const systemAdminNavigationLinks = [
  { name: "Dashboard", href: "/dashboard/admin" },
  { name: "User Management", href: "/dashboard/admin/users" },
  { name: "Curricular Area Management", href: "/dashboard/admin/curricular" },
  { name: "Announcements", href: "/dashboard/admin/announcements" },
  { name: "Support Messages", href: "/dashboard/admin/support-messages" },
  { name: "Settings", href: "/dashboard/admin/settings" },
  { name: "Profile", href: "/dashboard/admin/profile" },
];

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const router = useRouter();
  const { user } = useUserData();
  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount = unreadData?.count || 0;

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    performLogout();
    setIsPopUpOpen(false);
    router.push("/auth/login");
  };

  const role = getRole();
  const profileLink =
    role === "SYSTEM_ADMIN"
      ? "/dashboard/admin/profile"
      : role === "TEACHER"
      ? "/dashboard/teacher/profile"
      : "/dashboard/teacher/profile";

  const menuItems = [
    {
      label: "Profile",
      icon: <User size={22} />,
      onClick: () => {
        setIsPopUpOpen(false);
        router.push(profileLink);
      },
    },
    {
      label: "Logout",
      icon: <LogOut size={22} />,
      onClick: handleLogout,
    },
  ];

  const { scrollYProgress } = useScroll();
  const blurLevel = useTransform(scrollYProgress, [0, 0.1], ["0px", "20px"]);
  const navOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.85]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 0.1]);

  if (isLoading) return null;

  const navigationLinks = !isLoggedIn
    ? publicNavigationLinks
    : role === "SYSTEM_ADMIN"
    ? systemAdminNavigationLinks
    : loggedInNavigationLinks;

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
              {navigationLinks.map((link) => (
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
                {/* Notification Bell */}
                <NotificationBellWithPanel
                  showBackdrop={false}
                  customIcon={
                    <div className="flex justify-center items-center cursor-pointer w-[44px] h-[44px] rounded-full bg-white relative">
                      <Bell className="w-5.5 h-5.5 text-[#0C0C0C]" />
                    </div>
                  }
                />
                <div
                  className="relative flex flex-row gap-2 cursor-pointer items-center"
                  onClick={() => setIsPopUpOpen(true)}
                >
                  {/* User Profile */}
                  <div className="flex flex-col justify-center items-center w-[51px] h-[51px] rounded-full bg-white">
                    <UserAvatar
                      profilePictureUrl={user?.profilePictureUrl}
                      name={user?.name}
                      size="md"
                    />
                  </div>

                  <div className="flex flex-col gap-[4px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-base font-medium text-[#0C0C0C]">
                        {user ? (
                          user.name || "User"
                        ) : (
                          <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                        )}
                      </span>
                      {role === "SYSTEM_ADMIN" && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#2997F1]/10 text-[#2997F1] rounded text-[10px] font-medium">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-normal text-[#717171]">
                      {user?.email || ""}
                    </span>
                  </div>

                  {/* Dropdown Card */}
                  <PopupCard
                    isOpen={isPopUpOpen}
                    onClose={() => setIsPopUpOpen(false)}
                    align="right"
                  >
                    <div className="flex flex-col">
                      {menuItems.map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 6 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            item.onClick();
                            setIsPopUpOpen(false);
                          }}
                          className="flex flex-row items-center gap-3 px-5 py-3 text-left text-[15px] text-gray-800 font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-blue-600 group"
                        >
                          <span className="text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </PopupCard>
                </div>
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
            className="md:hidden absolute top-full left-0 right-0 w-full bg-white/80 border-t border-white/20 shadow-2xl z-50 max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col"
          >
            <div
              className="flex flex-col gap-2 backdrop-blur-2xl w-full overflow-y-auto scrollbar-hide px-4 py-6 pb-8"
              style={{
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
              }}
            >
              {/* Mobile Links */}
              {(isLoggedIn
                ? role === "SYSTEM_ADMIN"
                  ? systemAdminNavigationLinks
                  : loggedInNavigationLinks
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

              {/* Mobile User Section */}
              {isLoggedIn && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="pt-4 mt-4 border-t border-gray-200"
                >
                  {/* Mobile Notification Bell */}
                  <div className="px-4 mb-3">
                    <NotificationBellWithPanel
                      showBackdrop={false}
                      customIcon={
                        <div className="flex justify-center items-center cursor-pointer w-[44px] h-[44px] rounded-full bg-white relative">
                          <Bell className="w-5.5 h-5.5 text-[#0C0C0C]" />
                        </div>
                      }
                    />
                  </div>
                  <div className="flex flex-row gap-3 items-center px-4 py-3 bg-gray-50 rounded-lg">
                    <div className="flex flex-col justify-center items-center w-[44px] h-[44px] rounded-full bg-white">
                      <UserAvatar
                        profilePictureUrl={user?.profilePictureUrl}
                        name={user?.name}
                        size="md"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-medium text-[#0C0C0C]">
                          {user?.name || "User"}
                        </span>
                        {role === "SYSTEM_ADMIN" && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#2997F1]/10 text-[#2997F1] rounded text-[10px] font-medium">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-normal text-[#717171]">
                        {user?.email || ""}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Mobile Buttons */}
              <div className="pt-2 mt-2 border-t border-gray-200 flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    {menuItems.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 + idx * 0.05, duration: 0.3 }}
                      >
                        <button
                          onClick={() => {
                            item.onClick();
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                            item.label === "Logout"
                              ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                          }`}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      </motion.div>
                    ))}
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
