"use client";

import CustomSelect from "@/components/ui/CustomSelect";
import { FilterButtons } from "@/components/ui/FilterButtons";
import Post from "@/modules/dashboard/teacher/PostSection";
import { PostAttributes } from "@/types/postAttributes";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import CreatPostModal from "@/modules/dashboard/teacher/post/CreatPostModal";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useUserMyPostsFeeds } from "@/hooks/useUser";
import SectionLoading from "@/components/SectionLoading";
import { EmptyState } from "@/components/EmptyStateProps";
import MobilePostsClient from "./MobilePostsClient";

type YearOption = { value: string | boolean; label: string };

export default function PostsClientTeachers() {
  const [activeFilter, setActiveFilter] = useState<string | boolean>("all"); // Default "all" to show all posts
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSelect = (selected: YearOption | null) => {
    setActiveFilter(selected?.value ?? "all");
  };

  const {
    userMyPostFeedsData,
    isUserMyPostFeedsDataError,
    isUserMyPostFeedsDataLoading,
    isUserMyPostFeedsDataSuccess,
    isUserMyPostFeedsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserMyPostsFeeds();

  const allMyPosts = userMyPostFeedsData?.posts || [];

  const years: string[] = Array.from(
    new Set(
      allMyPosts.map((post: PostAttributes) =>
        new Date(post.createdAt).getFullYear().toString()
      )
    )
  );

  const yearOptions: YearOption[] = [
    { value: "all", label: "All" },
    ...years.map((year: string) => ({ value: year, label: year })),
  ];
  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
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

  const filteredYearMyPosts = allMyPosts.filter(
    (post: PostAttributes) => {
      return (
        new Date(post?.createdAt).getFullYear().toString() === activeFilter
      );
    }
  );
  const visiblePosts =
    activeFilter === "all" || activeFilter === "All"
      ? allMyPosts
      : filteredYearMyPosts;

  const hasMorePosts = Boolean(hasNextPage);

  console.log(activeFilter, visiblePosts);
  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden">
        <MobilePostsClient
          yearOptions={yearOptions}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          visiblePosts={visiblePosts}
          hasMorePosts={hasMorePosts}
          handleLoadMore={handleLoadMore}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isUserMyPostFeedsDataLoading}
        />
      </div>

      {/* Desktop Version - Original */}
      <div className="hidden md:flex bg-[#FDFDFD] py-11 px-6 rounded-[40px] flex-col">
        {/* top section */}
        <div className=" flex flex-row justify-between items-center">
          <h4 className="text-[#0C0C0C] text-xl font-medium">
            My Moderate Posts
          </h4>

          <div className="flex flex-row gap-1.5 items-center">
            <div className="min-w-[200px]">
              <CustomSelect
                options={yearOptions}
                defaultValue={yearOptions.find(
                  (option) => option.value === activeFilter
                )}
                onChange={(val) => {
                  const value = val
                    ? typeof val === "string"
                      ? val
                      : val.value
                    : "all";
                  setActiveFilter(value);
                }}
                placeholder="Select a year"
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
                  Share updates, announcements, or resources with your moderation team
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
            {isUserMyPostFeedsDataLoading ? (
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
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className={`bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isFetchingNextPage ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isFetchingNextPage ? "Loading..." : "Load More Posts"}
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={open} onOpenChange={setOpen}>
        <Modal.Content>
          <CreatPostModal />
        </Modal.Content>
      </Modal>
    </>
  );
}
