"use client";

import CustomSelect from "@/components/ui/CustomSelect";
import Post from "@/modules/dashboard/teacher/PostSection";
import { PostAttributes } from "@/types/postAttributes";
import { useState, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import CreatPostModal from "@/modules/dashboard/teacher/post/CreatPostModal";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useUserMyPostsFeeds, useUserData } from "@/hooks/useUser";
import SectionLoading from "@/components/SectionLoading";
import { EmptyState } from "@/components/EmptyStateProps";
import MobilePostsClient from "./MobilePostsClient";

export default function PostsClientTeachers() {
  const [selectedYear, setSelectedYear] = useState<string | null>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  // Get current user data to determine minimum year
  const { user } = useUserData();

  // Fetch all posts (no filter needed)
  const {
    userMyPostFeedsData,
    isUserMyPostFeedsDataError,
    isUserMyPostFeedsDataLoading,
    isUserMyPostFeedsDataSuccess,
    isUserMyPostFeedsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserMyPostsFeeds("all", 10);

  // Generate year options based on user's join date
  const yearOptions = useMemo(() => {
    if (!user?.createdAt) return [];
    
    const userJoinYear = new Date(user.createdAt).getFullYear();
    const currentYear = new Date().getFullYear();
    const years: { value: string; label: string }[] = [];
    
    // Add "All Years" option
    years.push({ value: "all", label: "All Years" });
    
    // Generate years from user's join year to current year
    for (let year = currentYear; year >= userJoinYear; year--) {
      years.push({ value: year.toString(), label: year.toString() });
    }
    
    return years;
  }, [user?.createdAt]);

  // Filter posts by selected year (client-side)
  const allMyPosts = useMemo(() => {
    const posts = userMyPostFeedsData?.posts || [];
    
    if (!selectedYear || selectedYear === "all") {
      return posts;
    }
    
    const year = parseInt(selectedYear);
    return posts.filter((post: PostAttributes) => {
      if (!post.createdAt) return false;
      const postYear = new Date(post.createdAt).getFullYear();
      return postYear === year;
    });
  }, [userMyPostFeedsData?.posts, selectedYear]);

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
  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden">
        <MobilePostsClient
          filters={yearOptions}
          activeFilter="all"
          setActiveFilter={() => {}}
          visiblePosts={allMyPosts}
          hasMorePosts={hasNextPage ?? false}
          handleLoadMore={handleLoadMore}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isUserMyPostFeedsDataLoading}
          selectedYear={selectedYear}
          onYearChange={(year) => {
            setSelectedYear(year);
            scrollToTop();
          }}
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
            {yearOptions.length > 0 && (
              <div className="w-48">
                <CustomSelect
                  options={yearOptions}
                  defaultValue={
                    selectedYear
                      ? yearOptions.find((y) => y.value === selectedYear)
                      : yearOptions[0]
                  }
                  onChange={(option) => {
                    setSelectedYear(option?.value as string | null);
                    scrollToTop();
                  }}
                  placeholder="Select Year"
                />
              </div>
            )}
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
                  Share updates, announcements, or resources with your
                  moderation team
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
            ) : allMyPosts?.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {allMyPosts?.map((post: PostAttributes, idx: number) => {
                  return <Post post={post} key={post.id ?? idx} />;
                })}
                {/* Load More Button - positioned below last post */}
                {hasNextPage && (
                  <div className="flex justify-center mt-6 pb-4">
                    <button
                      onClick={handleLoadMore}
                      disabled={isFetchingNextPage}
                      className={`bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        isFetchingNextPage
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isFetchingNextPage ? "Loading..." : "Load More Posts"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
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
