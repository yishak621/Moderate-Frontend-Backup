"use client";

import MobileCustomSelect from "@/components/ui/MobileCustomSelect";
import Post from "@/modules/dashboard/teacher/PostSection";
import { PostAttributes } from "@/types/postAttributes";
import { useState } from "react";
import { Plus, Camera, FileText } from "lucide-react";
import SectionLoading from "@/components/SectionLoading";
import { EmptyState } from "@/components/EmptyStateProps";
import MobileCreatePost from "./MobileCreatePost";
import Link from "next/link";
import { usePathname } from "next/navigation";

type YearOption = { value: string | boolean; label: string };

interface MobilePostsClientProps {
  yearOptions: YearOption[];
  activeFilter: string | boolean;
  setActiveFilter: (filter: string | boolean) => void;
  visiblePosts: PostAttributes[] | undefined;
  hasMorePosts: boolean;
  handleLoadMore: () => void;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
}

export default function MobilePostsClient({
  yearOptions,
  activeFilter,
  setActiveFilter,
  visiblePosts,
  hasMorePosts,
  handleLoadMore,
  isFetchingNextPage = false,
  isLoading = false,
}: MobilePostsClientProps) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const pathname = usePathname();

  const isGradingActive = pathname === "/dashboard/teacher/grading";
  const isPostsActive = pathname === "/dashboard/teacher/posts";

  if (showCreatePost) {
    return <MobileCreatePost onBack={() => setShowCreatePost(false)} />;
  }
  return (
    <div className=" py-3 px-3 flex flex-col gap-3 rounded-[20px] w-full max-w-full overflow-hidden">
      {/* Mobile Header with Tabs */}
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

        {/* Mobile Year Filter */}
        <div className="w-32">
          <MobileCustomSelect
            options={yearOptions}
            defaultValue={yearOptions.find(
              (option: any) => option.value === activeFilter
            )}
            onChange={(val: any) => {
              const value = val
                ? typeof val === "string"
                  ? val
                  : val.value
                : "all";
              setActiveFilter(value);
            }}
            placeholder="Year"
          />
        </div>
      </div>

      {/* Create New Post Section - Mobile */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[24.5px] border border-blue-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500 rounded-full">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0C0C0C]">
                Create New Post
              </h3>
              <p className="text-xs text-[#717171]">
                Upload exam or share updates
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowCreatePost(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-500 text-white rounded-[24.5px] hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span className="text-xs font-medium">Take Photo</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCreatePost(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-[24.5px] hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium">Upload File</span>
          </button>
        </div>
      </div>

      {/* Posts Container */}
      <div
        className="w-full overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
        id="posts-container"
      >
        {isLoading ? (
          <SectionLoading />
        ) : visiblePosts?.length === 0 ? (
          <EmptyState />
        ) : (
          visiblePosts?.map((post: PostAttributes, idx: number) => {
            return <Post post={post} key={post.id ?? idx} />;
          })
        )}
      </div>

      {/* Load More Button */}
      {hasMorePosts && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            className={`bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isFetchingNextPage ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isFetchingNextPage ? "Loading..." : "Load More Posts"}
          </button>
        </div>
      )}
    </div>
  );
}
