"use client";

import { CustomSelect } from "@/components/ui/CustomSelect";
import { FilterButtons } from "@/components/ui/FilterButtons";
import Post from "@/modules/dashboard/teacher/PostSection";
import { PostAttributes } from "@/types/postAttributes";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import CreatPostModal from "@/modules/dashboard/teacher/post/CreatPostModal";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useUserMyPostsFeeds, useUserPostFeeds } from "@/hooks/useUser";
import SectionLoading from "@/components/SectionLoading";
import { EmptyState } from "@/components/EmptyStateProps";

type YearOption = { value: string | boolean; label: string };

export default function PostsClientTeachers() {
  const [activeFilter, setActiveFilter] = useState<string | boolean>("All"); // ✅ default "All"
  const [visiblePostsCount, setVisiblePostsCount] = useState(5); // Start with 5 posts
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSelect = (selected: YearOption | null) => {
    setActiveFilter(selected?.value ?? "");
  };

  const {
    userMyPostFeedsData,
    isUserMyPostFeedsDataError,
    isUserMyPostFeedsDataLoading,
    isUserMyPostFeedsDataSuccess,
    isUserMyPostFeedsError,
  } = useUserMyPostsFeeds();

  const years: string[] = [
    ...new Set(
      userMyPostFeedsData?.posts.map((post: PostAttributes) =>
        new Date(post.createdAt).getFullYear().toString()
      ) as Set<string>
    ),
  ];

  const yearOptions: YearOption[] = [
    { value: "all", label: "All" },
    ...years.map((year: string) => ({ value: year, label: year })),
  ];
  const handleLoadMore = () => {
    setVisiblePostsCount((prev) => prev + 5); // Load 5 more posts
  };

  const scrollToTop = () => {
    const postsContainer = document.getElementById("posts-container");
    if (postsContainer) {
      postsContainer.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const filteredYearMyPosts = userMyPostFeedsData?.posts.filter(
    (post: PostAttributes) => {
      return new Date(post.createdAt).getFullYear().toString() === activeFilter;
    }
  );
  const visiblePosts =
    activeFilter === "All"
      ? userMyPostFeedsData?.posts.slice(0, visiblePostsCount)
      : filteredYearMyPosts?.slice(0, visiblePostsCount);

  const hasMorePosts =
    activeFilter === "All"
      ? visiblePostsCount < userMyPostFeedsData?.posts.length
      : visiblePostsCount < filteredYearMyPosts?.length;

  console.log(activeFilter, visiblePosts);
  return (
    <div className="bg-[#FDFDFD] py-11 px-6 rounded-[40px] flex flex-col">
      {/* top section */}
      <div className=" flex flex-row justify-between items-center">
        <h4 className="text-[#0C0C0C] text-xl font-medium">My Posts</h4>

        <div className="flex flex-row gap-1.5 items-center">
          {/* <div>
            <FilterButtons
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div> */}
          <div className="min-w-[200px]">
            <CustomSelect
              options={yearOptions}
              placeholder="Select a subject"
              onChange={handleSelect}
              defaultValue={yearOptions[0]}
            />
          </div>
        </div>
      </div>

      {/* Create New Post Section */}
      <div className="mt-6 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg ">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#0C0C0C]">
                Create New Post
              </h3>
              <p className="text-sm text-[#717171]">
                Share updates, announcements, or resources with your students
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>
      </div>
      {/* main sectioon */}
      <div className="scrollbar-hide ">
        <div
          className="w-full overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
          id="posts-container"
        >
          {!visiblePosts && <SectionLoading />}{" "}
          {visiblePosts?.length === 0 && <EmptyState />}
          {visiblePosts?.map((post: PostAttributes, idx: number) => {
            return <Post post={post} key={idx} />;
          })}
        </div>

        {/* Load More Button */}
        {hasMorePosts && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Load More Posts
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={open} onOpenChange={setOpen}>
        <Modal.Content>
          <CreatPostModal />
        </Modal.Content>
      </Modal>
    </div>
  );
}
