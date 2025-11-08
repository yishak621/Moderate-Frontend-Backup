"use client";

import SectionHeader from "@/components/SectionHeader";
import { FilterButtons } from "@/components/ui/FilterButtons";
import Post from "@/modules/dashboard/teacher/PostSection";
import { customJwtPayload, PostAttributes } from "@/types/postAttributes";
import { useEffect, useMemo, useState } from "react";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import {
  useUserPostFeeds,
  useFavoritePosts,
  useGetFollowingUsers,
} from "@/hooks/useUser";
import SectionLoading from "@/components/SectionLoading";
import { getToken } from "@/services/tokenService";
import { jwtDecode } from "jwt-decode";
import { EmptyState } from "@/components/EmptyStateProps";
import { decoded } from "@/lib/currentUser";
import MobileGradingClient from "./MobileGradingClient";

//this page collects all posts
export default function GradingClientTeachers() {
  const filters = ["All", "Moderated", "Pending", "Following", "Favorites"];
  const [activeFilter, setActiveFilterState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("gradingActiveFilter") || "Pending";
    }
    return "Pending";
  }); // ✅ default "Pending"

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedScroll = sessionStorage.getItem("gradingScroll");
    if (storedScroll) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: Number(storedScroll) || 0,
          behavior: "auto",
        });
      });
      sessionStorage.removeItem("gradingScroll");
    }
  }, []);

  const setActiveFilter = (filter: string) => {
    setActiveFilterState(filter);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("gradingActiveFilter", filter);
    }
  };

  const {
    userPostFeedsData,
    isUserPostFeedsDataError,
    isUserPostFeedsDataLoading,
    isUserPostFeedsDataSuccess,
    isUserPostFeedsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPostFeeds();

  const { favoritePostsData, isFavoritePostsDataLoading } = useFavoritePosts();
  const { followingUsers, isFollowingUsersLoading } = useGetFollowingUsers();

  const allPosts = useMemo(
    () => userPostFeedsData?.posts || [],
    [userPostFeedsData?.posts]
  );

  const followingIds = useMemo(
    () =>
      followingUsers?.following?.map((user: any) => user.id).filter(Boolean) ||
      [],
    [followingUsers]
  );

  const filteredFollowingPostFeedsData = allPosts.filter((post) =>
    followingIds.includes(post.author?.id)
  );

  const filteredModeratedPostFeedsData = allPosts.filter(
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

  const filteredPendingPostFeedsData = allPosts.filter(
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
    if (activeFilter === "Favorites") return;
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

  // Handle API response structure: { json: { favoritePosts: [...] } }
  const favoritePostsList =
    favoritePostsData?.json?.favoritePosts ||
    favoritePostsData?.favoritePosts ||
    (Array.isArray(favoritePostsData) ? favoritePostsData : []);

  const visiblePosts =
    activeFilter === "All"
      ? allPosts
      : activeFilter === "Moderated"
      ? filteredModeratedPostFeedsData
      : activeFilter === "Pending"
      ? filteredPendingPostFeedsData
      : activeFilter === "Following"
      ? filteredFollowingPostFeedsData
      : activeFilter === "Favorites"
      ? favoritePostsList
      : [];

  const shouldShowLoadMore =
    (visiblePosts?.length || 0) > 0 &&
    (activeFilter === "Favorites" ? false : hasNextPage);

  const isActiveFilterLoading =
    (activeFilter === "Favorites" && isFavoritePostsDataLoading) ||
    (activeFilter === "Following" && isFollowingUsersLoading);
  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileGradingClient
          filters={filters}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          visiblePosts={visiblePosts}
          hasMorePosts={shouldShowLoadMore}
          handleLoadMore={handleLoadMore}
          scrollToTop={scrollToTop}
          isFavoritePostsDataLoading={isFavoritePostsDataLoading}
          isUserPostFeedsDataLoading={isUserPostFeedsDataLoading}
          isFetchingNextPage={isFetchingNextPage}
          isFollowingUsersLoading={isFollowingUsersLoading}
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
            {(isUserPostFeedsDataLoading || isActiveFilterLoading) && (
              <SectionLoading />
            )}
            {!isUserPostFeedsDataLoading &&
              !isActiveFilterLoading &&
              visiblePosts?.length === 0 && <EmptyState />}
            {!isUserPostFeedsDataLoading &&
              !isActiveFilterLoading &&
              visiblePosts?.map((post: PostAttributes, idx: number) => {
                return <Post post={post} key={post.id ?? idx} />;
              })}
          </div>

          {/* Load More Button */}
          {shouldShowLoadMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] text-white font-medium shadow-lg shadow-blue-200 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Posts</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
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
