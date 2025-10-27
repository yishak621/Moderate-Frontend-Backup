"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const pathname = usePathname();

  // Get current page name based on pathname
  const getCurrentPageName = () => {
    if (pathname === "/") return "Moderate";
    if (pathname === "/about") return "About";
    if (pathname === "/features") return "Features";
    if (pathname === "/pricing") return "Pricing";
    if (pathname === "/faqs") return "FAQ";
    if (pathname === "/contact") return "Contact";
    return title; // fallback
  };

  const currentPageName = getCurrentPageName();

  return (
    <div className="flex flex-col items-center justify-center py-[100px]">
      {/* Breadcrumb Navigation - Only Moderate / Current Page */}
      <div className="flex flex-row items-center gap-2 mb-8">
        <Link
          href="/"
          className={`text-sm font-medium transition-all duration-200 ${
            pathname === "/"
              ? "text-[#000] font-bold"
              : "text-[#666] hover:text-blue-600"
          }`}
        >
          Moderate
        </Link>
        <span className="text-[#999] mx-1">/</span>
        <span
          className={`text-sm font-medium transition-all duration-200 ${
            pathname === "/" ? "text-[#666]" : "text-[#000] font-bold"
          }`}
        >
          {currentPageName}
        </span>
      </div>

      {/* Page Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-[#000]">
        {title}
      </h1>
    </div>
  );
}
