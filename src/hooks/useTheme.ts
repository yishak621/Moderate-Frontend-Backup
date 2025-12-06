"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export type Theme = "light" | "dark";

const THEME_COOKIE_NAME = "theme";
const THEME_COOKIE_OPTIONS = {
  expires: 365, // 1 year
  sameSite: "lax" as const,
  path: "/",
};

// Apply theme to HTML element
function applyTheme(theme: Theme) {
  const html = document.documentElement;
  
  // Remove dark class first
  html.classList.remove("dark");
  
  if (theme === "dark") {
    html.classList.add("dark");
    html.style.colorScheme = "dark";
  } else {
    html.style.colorScheme = "light";
  }
}

// Get initial theme from cookie, localStorage (fallback), or system preference
function getInitialTheme(): Theme {
  // Try cookie first
  const cookieTheme = Cookies.get(THEME_COOKIE_NAME);
  if (cookieTheme === "dark" || cookieTheme === "light") {
    return cookieTheme;
  }
  
  // Fallback to localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(THEME_COOKIE_NAME);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
  }
  
  // Fallback to system preference
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  
  return "light";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  // Set theme and persist to both cookie and localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Store in cookie (primary)
    Cookies.set(THEME_COOKIE_NAME, newTheme, THEME_COOKIE_OPTIONS);
    
    // Also store in localStorage (fallback)
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_COOKIE_NAME, newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return { theme, setTheme, toggleTheme, mounted };
}
