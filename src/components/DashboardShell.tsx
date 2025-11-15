"use client";

import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Input from "./ui/Input";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronLeft,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Search,
  X,
} from "lucide-react";
import NotificationBellWithPanel from "@/components/NotificationBellWithPanel";
import { Bell } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useUserData } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { removeToken } from "@/services/tokenService";
import UserAvatar from "@/components/UserAvatar";

// theme icons removed since theme toggle is disabled

export type NavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  badgeCount?: number; // Optional badge count for unread items
};

type DashboardShellProps = {
  children: ReactNode;
  sidebarItems: NavItem[];
  title?: string;
  onSearchChange?: (value: string) => void;
  initialSearch?: string;
  rightContent?: React.ReactNode;
  mobileSidebarItems?: NavItem[];
  place?: string;
};

function checkIsActive(pathname: string, href: string) {
  const pathAfterDashboard = pathname.replace("/dashboard", "");
  const hrefAfterDashboard = href.replace("/dashboard", "");

  return pathAfterDashboard === hrefAfterDashboard;
}

export default function DashboardShell({
  children,
  sidebarItems,
  mobileSidebarItems = [],
  title = "Dashboard",
  onSearchChange,
  initialSearch = "",
  rightContent,
  place = "admin",
}: DashboardShellProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);
  const { user } = useUserData();
  const router = useRouter();
  const queryClient = useQueryClient();

  // const [theme] = useState<"light" | "dark">(() => {
  //   if (typeof window === "undefined") return "light";
  //   const stored = window.localStorage.getItem("theme");
  //   if (stored === "light" || stored === "dark") return stored;
  //   const prefersDark =
  //     window.matchMedia &&
  //     window.matchMedia("(prefers-color-scheme: dark)").matches;
  //   return prefersDark ? "dark" : "light";
  // });

  // useLayoutEffect(() => {
  //   const root = document.documentElement;
  //   if (theme === "dark") {
  //     root.classList.add("dark");
  //   } else {
  //     root.classList.remove("dark");
  //   }
  //   window.localStorage.setItem("theme", theme);
  //   root.style.colorScheme = theme;
  // }, [theme]);

  useEffect(() => {
    if (!onSearchChange) return;
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = window.setTimeout(() => {
      onSearchChange(search);
    }, 300);
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [search, onSearchChange]);

  const activeSet = useMemo(() => new Set([pathname]), [pathname]);

  return (
    <div className="flex h-screen w-full max-w-screen bg-[#F1F1F1] overflow-x-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside
        className={clsx(
          "hidden md:flex transition-all duration-300 bg-whiteCard shadow-lg flex-col overflow-y-scroll scrollbar-hide",
          isExpanded ? "w-64" : "w-20 2xl:w-25"
        )}
      >
        <div className="flex items-center justify-between pt-6 2xl:pt-11 px-4 2xl:px-7.5">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/logo/logo-1.png"
              alt="Moderate Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="object-contain w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 lg:w-16 lg:h-16"
            />

            {isExpanded && (
              <div className="flex flex-col ml-2">
                <span className="font-medium text-2xl text-[#0C0C0C]">
                  Moderate
                </span>
                <span className="text-sm font-normal text-[#717171]">
                  Grade moderation made easy
                </span>
              </div>
            )}
          </Link>

          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isExpanded ? (
              <ChevronLeft size={20} className="text-[#0C0C0C]" />
            ) : (
              <ChevronRight size={20} className="text-[#0C0C0C]" />
            )}
          </button>
        </div>
        {/* 
              SIDEBAR NAV ITEMS
              */}
        <nav
          className={clsx(
            "mt-6 flex flex-col space-y-2 h-full",
            isExpanded ? " 2xl:px-7.5 px-2" : "px-0"
          )}
        >
          {sidebarItems.map(({ label, icon: Icon, href, badgeCount }) => {
            const isActive = checkIsActive(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "group relative flex items-center gap-3 rounded-[41px] transition-all duration-300 ease-out",
                  isExpanded ? "py-5 px-5.5" : "p-5 justify-center",
                  isActive
                    ? "bg-white shadow-sm ring-1 ring-gray-100"
                    : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                )}
              >
                {/* Animated background glow */}
                <span
                  className={clsx(
                    "absolute inset-0 rounded-[41px] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300",
                    isActive
                      ? "bg-[#E3EEFF]"
                      : "bg-gradient-to-r from-blue-50 to-transparent"
                  )}
                />

                {/* Icon */}
                {Icon && (
                  <span className="relative flex-shrink-0 w-6 h-6 flex items-center justify-center transition-all duration-300">
                    <Icon
                      size={22}
                      className={clsx(
                        "transition-colors duration-300",
                        isActive
                          ? "text-[#0C0C0C]"
                          : "text-[#717171] group-hover:text-[#0C0C0C]"
                      )}
                    />
                    {/* Badge Count */}
                    {badgeCount !== undefined && badgeCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className={clsx(
                          "absolute -top-1 -right-1 bg-[#368FFF] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg z-10 border-2 border-white",
                          !isExpanded && "min-w-[12px] h-[12px] text-[8px]"
                        )}
                      >
                        {badgeCount > 99 ? "99+" : badgeCount}
                      </motion.span>
                    )}
                  </span>
                )}

                {/* Label */}
                {isExpanded && (
                  <span
                    className={clsx(
                      "relative truncate max-w-[150px] transition-all duration-300 flex items-center gap-2",
                      isActive
                        ? "text-[#0C0C0C] font-semibold"
                        : "text-[#717171] group-hover:text-[#0C0C0C] font-medium"
                    )}
                  >
                    {label}
                    {/* Badge Count next to label (when expanded) */}
                    {badgeCount !== undefined && badgeCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="bg-[#368FFF] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm"
                      >
                        {badgeCount > 99 ? "99+" : badgeCount}
                      </motion.span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* <div className="mt-auto p-3">
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className={clsx(
              "group relative w-full rounded-full border border-gray-300 dark:border-gray-700 px-2 py-2",
              "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200",
              "overflow-hidden"
            )}
            aria-label="Toggle theme"
          >
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "relative h-6 w-11 rounded-full transition-colors",
                  theme === "dark" ? "bg-blue-600" : "bg-gray-300"
                )}
              >
                <span
                  className={clsx(
                    "absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow transform transition-all duration-300",
                    theme === "dark"
                      ? "translate-x-6 rotate-180"
                      : "translate-x-0 rotate-0"
                  )}
                />
              </div>
              {isExpanded && (
                <div className="flex items-center gap-2">
                  <Sun
                    size={18}
                    className={clsx(
                      "transition-transform duration-300",
                      theme === "dark"
                        ? "scale-75 opacity-60"
                        : "scale-100 opacity-100"
                    )}
                  />
                  <span className="text-sm select-none">
                    {theme === "dark" ? "Dark" : "Light"} mode
                  </span>
                  <Moon
                    size={18}
                    className={clsx(
                      "transition-transform duration-300",
                      theme === "dark"
                        ? "scale-100 opacity-100"
                        : "scale-75 opacity-60"
                    )}
                  />
                </div>
              )}
            </div>
          </button>
        </div> */}
      </aside>

      {/* Mobile Sidebar - Slides in from left */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 md:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-64 shadow-xl z-50 md:hidden flex flex-col"
              style={{ backgroundColor: "#EFF3F7" }}
            >
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <Image
                    src="/images/logo/logo-1.png"
                    alt="Moderate Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-xl text-[#0C0C0C]">
                      Moderate
                    </span>
                    <span className="text-xs font-normal text-[#717171]">
                      Grade moderation made easy
                    </span>
                  </div>
                </Link>
              </div>

              {/* Mobile Sidebar Nav */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {mobileSidebarItems.map(
                  ({ label, icon: Icon, href, badgeCount }) => {
                    const isActive = checkIsActive(pathname, href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className={clsx(
                          "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all relative",
                          isActive
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {Icon && (
                          <span className="relative">
                            <Icon size={22} />
                            {/* Badge Count on mobile */}
                            {badgeCount !== undefined && badgeCount > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 30,
                                }}
                                className="absolute -top-1 -right-1 bg-[#368FFF] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg z-10 border-2 border-white"
                              >
                                {badgeCount > 99 ? "99+" : badgeCount}
                              </motion.span>
                            )}
                          </span>
                        )}
                        <span className="text-sm flex items-center gap-2">
                          {label}
                          {/* Badge Count next to label on mobile */}
                          {badgeCount !== undefined && badgeCount > 0 && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                              className="bg-[#368FFF] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm"
                            >
                              {badgeCount > 99 ? "99+" : badgeCount}
                            </motion.span>
                          )}
                        </span>
                      </Link>
                    );
                  }
                )}
              </nav>

              {/* Mobile Sidebar Footer - User profile and quick logout */}
              <div className="border-t border-gray-200 p-4 mt-auto">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    profilePictureUrl={user?.profilePictureUrl || ""}
                    name={user?.name}
                    size="sm"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-[#0C0C0C] truncate">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-[#717171] truncate">
                      {user?.email || ""}
                    </span>
                  </div>
                </div>
                <button
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 text-sm font-medium transition-colors"
                  onClick={async () => {
                    // Match desktop logout: clear react-query cache and remove tokens
                    queryClient.clear();
                    removeToken();
                    router.push("/auth/login");
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col md:ml-0 min-w-0 max-w-full overflow-hidden">
        {/* Desktop Header - Hidden on mobile */}
        <header className="hidden md:flex items-center justify-between bg-whiteCard p-4 pt-6 2xl:pt-11 pl-5.5 gap-4 min-w-0 max-w-full overflow-visible">
          <h1 className="text-3xl font-medium text-[#0C0C0C] whitespace-nowrap">
            {title}
          </h1>
          {place === "teacher" && (
            <div className="flex-1 max-w-xl">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
          <div className="min-w-[120px] flex items-center justify-end">
            {rightContent}
          </div>
        </header>

        {/* Mobile Header - Only visible on mobile */}
        <header className="md:hidden bg-whiteCard px-2 py-3 min-w-0 w-full max-w-[100vw] overflow-visible">
          <div className="flex items-center justify-between gap-2 w-full">
            {/* Left: Menu Toggle + Title */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 shrink-0"
              >
                <Menu size={20} className="text-gray-600" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-sm sm:text-base font-medium text-[#0C0C0C] truncate">
                  Hi,{" "}
                  {user?.name && user.name.length > 18
                    ? user.name.substring(0, 18) + "…"
                    : user?.name}
                </h1>
                <p className="text-[11px] text-[#717171]">
                  Welcome to Moderate!
                </p>
              </div>
            </div>

            {/* Right: Search + Notifications */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="p-1.5 rounded-full hover:bg-gray-100 border border-[#DBDBDB] w-9 h-9 flex items-center justify-center"
                aria-label="Open search"
              >
                <Search size={12} className="text-[#000000]" />
              </button>
              <NotificationBellWithPanel
                customIcon={
                  <div className="flex justify-center items-center cursor-pointer w-9 h-9 rounded-full  border border-[#DBDBDB]">
                    <Bell className="w-4 h-4 text-[#0C0C0C]" />
                  </div>
                }
              />
            </div>
          </div>

          {/* Mobile Search Bar - Expandable */}
          <AnimatePresence>
            {showMobileSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 overflow-hidden"
              >
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <section className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 sm:py-6 scrollbar-hide max-w-full min-w-0">
          <div className="max-w-full overflow-hidden w-full">{children}</div>
        </section>
      </main>
    </div>
  );
}
