"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles, FileCheck, Search } from "lucide-react";
import { ReactNode } from "react";

const subNavItems = [
  {
    label: "AI Grader",
    href: "/dashboard/teacher/ai-analysis/ai-grader",
    icon: Sparkles,
  },
  {
    label: "Content Detector",
    href: "/dashboard/teacher/ai-analysis/ai-content-detector",
    icon: FileCheck,
  },
  {
    label: "Similarity Checker",
    href: "/dashboard/teacher/ai-analysis/ai-similarity-checker",
    icon: Search,
  },
];

export default function AIAnalysisLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isSubPage = pathname !== "/dashboard/teacher/ai-analysis";

  return (
    <div className="flex flex-col h-full">
      {/* Sub-navigation - Only show on sub-pages */}
      {isSubPage && (
        <div className="border-b border-gray-200 bg-white">
          <div className=" mx-auto px-4 sm:px-6">
            <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
              {subNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                      ${
                        isActive
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
