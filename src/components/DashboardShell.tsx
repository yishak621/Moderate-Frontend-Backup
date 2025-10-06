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
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Image from "next/image";

// theme icons removed since theme toggle is disabled

export type NavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
};

type DashboardShellProps = {
  children: ReactNode;
  sidebarItems: NavItem[];
  title?: string;
  onSearchChange?: (value: string) => void;
  initialSearch?: string;
  rightContent?: React.ReactNode;
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
  title = "Dashboard",
  onSearchChange,
  initialSearch = "",
  rightContent,
  place = "admin",
}: DashboardShellProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const debounceTimerRef = useRef<number | null>(null);

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
    <div className="flex h-screen w-full bg-[#F1F1F1]">
      <aside
        className={clsx(
          "transition-all duration-300 bg-whiteCard shadow-lg flex flex-col overflow-y-scroll scrollbar-hide ",
          isExpanded ? "w-64" : "w-20"
        )}
      >
        <div className="flex items-center justify-between pt-6 2xl:pt-11 p-4 2xl:px-7.5 px-2  ">
          {isExpanded && (
            <div className="flex flex-col gap-1 items-start">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo/logo-1.png"
                  alt="Moderate Logo"
                  width={17}
                  height={26}
                  className="object-contain"
                />
                <span className="font-medium text-2xl ">Moderate</span>
              </div>
              <span className="text-base font-normal text-[#717171]">
                Management Portal System
              </span>
            </div>
          )}

          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="text-[#0C0C0C] cursor-pointer"
            aria-label="Toggle sidebar"
          >
            {isExpanded ? (
              <PanelLeftClose size={18} />
            ) : (
              <PanelLeftOpen size={18} />
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
          {sidebarItems.map(({ label, icon: Icon, href }) => {
            const isActive = checkIsActive(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "text-base font-medium flex items-center gap-3 rounded-[41px] ",
                  isExpanded ? "py-5 px-5.5" : "p-5 justify-center",
                  isActive && "bg-[#FDFDFD]"
                )}
              >
                {/* Icon wrapper with fixed width */}
                {Icon && (
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <Icon
                      size={22}
                      className={`${
                        isActive ? "text-[#0C0C0C]" : "text-[#717171]"
                      }`}
                    />
                  </span>
                )}

                {/* Truncated text */}
                {isExpanded && (
                  <span
                    className={clsx(
                      "truncate max-w-[150px]", // <-- control max label width
                      isActive
                        ? "text-[#0C0C0C] font-medium"
                        : "text-[#717171] font-normal",
                      "text-base"
                    )}
                  >
                    {label}
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

      <main className="flex-1 flex flex-col">
        {/* main top section */}
        <header className="flex items-center justify-between bg-whiteCard p-4 pt-6 2xl:pt-11 pl-5.5  gap-4">
          <h1 className="text-3xl font-medium text-[#0C0C0C]  whitespace-nowrap">
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

        <section className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {children}
        </section>
      </main>
    </div>
  );
}
