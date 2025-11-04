"use client";

import MobileCustomSelect from "@/components/ui/MobileCustomSelect";
import Post from "@/modules/dashboard/teacher/PostSection";
import { PostAttributes } from "@/types/postAttributes";
import { ChevronUp } from "lucide-react";
import SectionLoading from "@/components/SectionLoading";
import { EmptyState } from "@/components/EmptyStateProps";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileGradingClientProps {
  filters: string[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  visiblePosts: PostAttributes[] | undefined;
  hasMorePosts: boolean;
  handleLoadMore: () => void;
  scrollToTop: () => void;
}

export default function MobileGradingClient({
  filters,
  activeFilter,
  setActiveFilter,
  visiblePosts,
  hasMorePosts,
  handleLoadMore,
  scrollToTop,
}: MobileGradingClientProps) {
  const pathname = usePathname();

  // Convert string filters to Option format for CustomSelect
  const filterOptions = filters.map((filter) => ({
    value: filter,
    label: filter,
  }));

  const isGradingActive = pathname === "/dashboard/teacher/grading";
  const isPostsActive = pathname === "/dashboard/teacher/posts";

  return (
    <div className="py-3 px-3 flex flex-col gap-3 rounded-[20px] w-full max-w-full overflow-hidden">
      {/* Mobile Header with Tabs and Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 border-b border-gray-200">
          <Link
            href="/dashboard/teacher/grading"
            className={`px-3 py-2 text-sm font-medium transition-all relative ${
              isGradingActive
                ? "text-[#0C0C0C] font-semibold"
                : "text-[#717171] hover:text-[#0C0C0C]"
            }`}
          >
            Moderate
            {isGradingActive && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0C0C0C]" />
            )}
          </Link>
          <Link
            href="/dashboard/teacher/posts"
            className={`px-3 py-2 text-sm font-medium transition-all relative ${
              isPostsActive
                ? "text-[#0C0C0C] font-semibold"
                : "text-[#717171] hover:text-[#0C0C0C]"
            }`}
          >
            My Posts
            {isPostsActive && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0C0C0C]" />
            )}
          </Link>
        </div>

        {/* Mobile Filter */}
        <div className="w-32">
          <MobileCustomSelect
            options={filterOptions}
            defaultValue={filterOptions.find(
              (opt) => opt.value === activeFilter
            )}
            onChange={(val: any) => {
              const valueStr = val
                ? typeof val === "string"
                  ? val
                  : val.value
                : "";
              setActiveFilter(valueStr);
            }}
            placeholder="Filter"
          />
        </div>
      </div>

      {/* Posts Container */}
      <div
        className="w-full overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
        id="posts-container"
      >
        {!visiblePosts && <SectionLoading />}
        {visiblePosts?.length === 0 && <EmptyState />}
        {visiblePosts?.map((post: PostAttributes, idx: number) => {
          return <Post post={post} key={idx} />;
        })}
      </div>

      {/* Load More Button */}
      {hasMorePosts && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Load More Posts
          </button>
        </div>
      )}

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50"
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
}
