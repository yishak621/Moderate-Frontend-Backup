"use client";

import CustomSelect from "@/components/ui/CustomSelect";
import Post from "@/modules/dashboard/teacher/PostSection";
import { PostAttributes } from "@/types/postAttributes";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import SectionLoading from "@/components/SectionLoading";
import { EmptyState } from "@/components/EmptyStateProps";
import MobileCreatePost from "./MobileCreatePost";

type YearOption = { value: string | boolean; label: string };

interface MobilePostsClientProps {
  yearOptions: YearOption[];
  activeFilter: string | boolean;
  setActiveFilter: (filter: string | boolean) => void;
  visiblePosts: PostAttributes[] | undefined;
  hasMorePosts: boolean;
  handleLoadMore: () => void;
}

export default function MobilePostsClient({
  yearOptions,
  activeFilter,
  setActiveFilter,
  visiblePosts,
  hasMorePosts,
  handleLoadMore,
}: MobilePostsClientProps) {
  const [showCreatePost, setShowCreatePost] = useState(false);

  if (showCreatePost) {
    return <MobileCreatePost onBack={() => setShowCreatePost(false)} />;
  }
  return (
    <div className="bg-[#FDFDFD] py-3 px-3 flex flex-col gap-3 rounded-[20px] w-full max-w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[#0C0C0C] text-lg font-medium">My Posts</h4>

        {/* Mobile Year Filter */}
        <div className="w-32">
          <CustomSelect
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
            placeholder="Select year"
          />
        </div>
      </div>

      {/* Create New Post Section - Mobile */}
      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowCreatePost(true)}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#0C0C0C]">
                Create New Post
              </h3>
              <p className="text-xs text-[#717171]">
                Share updates with students
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreatePost(true)}
            className="flex items-center gap-1 px-3 py-2 text-xs"
          >
            <Plus className="w-3 h-3" />
            New
          </Button>
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
    </div>
  );
}
