"use client";

import SectionHeader from "@/components/SectionHeader";
import { FilterButtons } from "@/components/ui/FilterButtons";
import Post from "@/modules/dashboard/teacher/PostSection";
import { customJwtPayload, PostAttributes } from "@/types/postAttributes";
import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { useUserPostFeeds } from "@/hooks/useUser";
import SectionLoading from "@/components/SectionLoading";
import { getToken } from "@/services/tokenService";
import { jwtDecode } from "jwt-decode";
import { EmptyState } from "@/components/EmptyStateProps";
import { decoded } from "@/lib/currentUser";
import MobileGradingClient from "./MobileGradingClient";

//this page collects all posts
export default function GradingClientTeachers() {
  const filters = ["All", "Moderated", "Pending"];
  const [activeFilter, setActiveFilter] = useState("Pending"); // ✅ default "All"
  const [visiblePostsCount, setVisiblePostsCount] = useState(5); // Start with 5 posts

  const {
    userPostFeedsData,
    isUserPostFeedsDataError,
    isUserPostFeedsDataLoading,
    isUserPostFeedsDataSuccess,
    isUserPostFeedsError,
  } = useUserPostFeeds();

  const filteredModeratedPostFeedsData = userPostFeedsData?.posts.filter(
    (post: PostAttributes) => {
      const hasCommented = post.comments.some(
        (comment) => comment.commentedBy === decoded?.id
      );

      const hasGraded = post.grades?.some(
        (grade) => grade.gradedBy === decoded?.id
      );

      return hasCommented || hasGraded; // Moderated if user did either
    }
  );

  const filteredPendingPostFeedsData = userPostFeedsData?.posts.filter(
    (post: PostAttributes) => {
      const notCommented = !post.comments.some(
        (comment) => comment.commentedBy === decoded?.id
      );

      const notGraded = !post.grades?.some(
        (grade) => grade.gradedBy === decoded?.id
      );

      const notMyPost = post?.author.id !== decoded?.id;

      return notCommented && notGraded && notMyPost; // Pending if user did neither
    }
  );

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

  const visiblePosts =
    activeFilter === "All"
      ? userPostFeedsData?.posts.slice(0, visiblePostsCount)
      : activeFilter === "Moderated"
      ? filteredModeratedPostFeedsData?.slice(0, visiblePostsCount)
      : activeFilter === "Pending"
      ? filteredPendingPostFeedsData?.slice(0, visiblePostsCount)
      : [];
  console.log(activeFilter, "filter", visiblePosts);

  const hasMorePosts =
    activeFilter === "All"
      ? visiblePostsCount < (userPostFeedsData?.posts.length || 0)
      : activeFilter === "Moderated"
      ? visiblePostsCount < (filteredModeratedPostFeedsData?.length || 0)
      : activeFilter === "Pending"
      ? visiblePostsCount < (filteredPendingPostFeedsData?.length || 0)
      : false;
  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileGradingClient
          filters={filters}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          visiblePosts={visiblePosts}
          hasMorePosts={hasMorePosts}
          handleLoadMore={handleLoadMore}
          scrollToTop={scrollToTop}
        />
      </div>

      {/* Desktop Version - Original */}
      <div className="hidden md:flex bg-[#FDFDFD] py-5.5 px-6 flex-col gap-5 rounded-[40px]">
        {/* left side */}
        <div className="p-6 w-full">
          {/* left top */}
          <div className="flex flex-row justify-between mb-5 flex-wrap">
            <SectionHeader
              title="Recent moderation posts from Your School"
              subheader="Moderation posts by teachers in your domain"
            />

            <div>
              <FilterButtons
                filters={filters}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>
          </div>

          {/* left bottom */}
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

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      </div>
    </>
  );
}
