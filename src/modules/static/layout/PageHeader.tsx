"use client";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  pathname?: string;
}

export default function PageHeader({ title, pathname = "" }: PageHeaderProps) {
  const isHomePage = pathname === "/";

  return (
    <div className="flex flex-col items-center justify-center py-[100px]">
      {/* Breadcrumb Navigation - Only Moderate / Current Page */}
      <div className="flex flex-row items-center gap-2 mb-8">
        {isHomePage ? (
          <span className="text-sm font-bold text-[#000]">Moderate</span>
        ) : (
          <Link
            href="/"
            className="text-sm font-medium text-[#666] hover:text-blue-600 transition-all duration-200"
          >
            Moderate
          </Link>
        )}
        <span className="text-[#999] mx-1">/</span>
        {isHomePage ? (
          <span className="text-sm font-medium text-[#666]">Moderate</span>
        ) : (
          <span className="text-sm font-bold text-[#000]">{title}</span>
        )}
      </div>

      {/* Page Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-[#000]">
        {title}
      </h1>
    </div>
  );
}
