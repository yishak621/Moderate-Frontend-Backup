"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import clsx from "clsx";

interface DarkModeToggleProps {
  variant?: "icon" | "full";
  className?: string;
}

export default function DarkModeToggle({
  variant = "icon",
  className,
}: DarkModeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={clsx(
          "rounded-full bg-gray-100",
          variant === "icon" ? "w-10 h-10" : "w-14 h-8",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  if (variant === "icon") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className={clsx(
          "relative w-10 h-10 rounded-full",
          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
          "flex items-center justify-center",
          "transition-all duration-300 ease-in-out",
          "hover:scale-110 active:scale-95",
          "hover:bg-gray-50 dark:hover:bg-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          className
        )}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <motion.div
          initial={false}
          animate={{
            rotate: isDark ? 180 : 0,
            scale: isDark ? 0.8 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <Moon size={18} className="text-blue-400" />
          ) : (
            <Sun size={18} className="text-amber-500" />
          )}
        </motion.div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={clsx(
        "relative w-14 h-8 rounded-full",
        "bg-gradient-to-r transition-all duration-500",
        isDark
          ? "from-blue-600 to-purple-600"
          : "from-amber-400 to-orange-400",
        "flex items-center px-1",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "hover:scale-105 active:scale-95",
        "shadow-lg",
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        className={clsx(
          "w-6 h-6 rounded-full",
          "bg-white",
          "flex items-center justify-center",
          "shadow-md",
          "border border-gray-200"
        )}
      >
        <motion.div
          animate={{
            rotate: isDark ? 180 : 0,
            scale: isDark ? 0.9 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          {isDark ? (
            <Moon size={14} className="text-blue-500" />
          ) : (
            <Sun size={14} className="text-amber-500" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
}
