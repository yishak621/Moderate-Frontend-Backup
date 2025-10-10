"use client";

import SectionHeader from "@/components/SectionHeader";
import { FilterButtons } from "@/components/ui/FilterButtons";
import Post from "@/modules/dashboard/teacher/PostSection";
import { PostAttributes } from "@/types/postAttributes";
import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { useUserPostFeeds } from "@/hooks/useUser";

// export const samplePosts: PostAttributes[] = [
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "1-Introduction to Algorithms",
//     description: "This is a post for grade 8 ..................",
//     posted_by: "Prof. Thomas",
//     uploaded_at: "2025-09-25",
//     files: [
//       "https://arxiv.org/pdf/2111.01147.pdf", // sample CS research paper
//       "https://www.gutenberg.org/files/84/84-pdf.pdf", // Frankenstein (public domain)
//     ],
//     post_tags: ["Algorithms", "CS", "Education"],
//     post_status: "published",
//     post_grade_avg: 4.5,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "2-Modern Physics Basics",
//     description: "This is a post for grade 8 ..................",

//     posted_by: "Dr. Einstein",
//     uploaded_at: "2025-09-20",
//     files: [
//       "https://arxiv.org/pdf/quant-ph/0410100.pdf", // quantum mechanics paper
//     ],
//     post_tags: ["Physics", "Quantum", "Education"],
//     post_status: "draft",
//     post_grade_avg: 4.2,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "3-Public Speaking Guide",
//     description: "This is a post for grade 8 ..................",

//     posted_by: "Ms. Johnson",
//     uploaded_at: "2025-09-15",
//     files: [
//       "https://www.gutenberg.org/files/16317/16317-pdf.pdf", // Dale Carnegie-like public domain text
//     ],
//     post_tags: ["Soft Skills", "Communication"],
//     post_status: "archived",
//     post_grade_avg: 3.9,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "4-Introduction to Algorithms",
//     description: "This is a post for grade 8 ..................",

//     posted_by: "Prof. Thomas",
//     uploaded_at: "2025-09-25",
//     files: [
//       "https://arxiv.org/pdf/2111.01147.pdf", // sample CS research paper
//       "https://www.gutenberg.org/files/84/84-pdf.pdf", // Frankenstein (public domain)
//     ],
//     post_tags: ["Algorithms", "CS", "Education"],
//     post_status: "published",
//     post_grade_avg: 4.5,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "5-Modern Physics Basics",
//     description: "This is a post for grade 8 ..................",

//     posted_by: "Dr. Einstein",
//     uploaded_at: "2025-09-20",
//     files: [
//       "https://arxiv.org/pdf/quant-ph/0410100.pdf", // quantum mechanics paper
//     ],
//     post_tags: ["Physics", "Quantum", "Education"],
//     post_status: "draft",
//     post_grade_avg: 4.2,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "6-Public Speaking Guide",
//     description: "This is a post for grade 8 ..................",

//     posted_by: "Ms. Johnson",
//     uploaded_at: "2025-09-15",
//     files: [
//       "https://www.gutenberg.org/files/16317/16317-pdf.pdf", // Dale Carnegie-like public domain text
//     ],
//     post_tags: ["Soft Skills", "Communication"],
//     post_status: "archived",
//     post_grade_avg: 3.9,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "7-Introduction to Algorithms",
//     description: "This is a post for grade 8 ..................",

//     posted_by: "Prof. Thomas",
//     uploaded_at: "2025-09-25",
//     files: [
//       "https://arxiv.org/pdf/2111.01147.pdf", // sample CS research paper
//       "https://www.gutenberg.org/files/84/84-pdf.pdf", // Frankenstein (public domain)
//     ],
//     post_tags: ["Algorithms", "CS", "Education"],
//     post_status: "published",
//     post_grade_avg: 4.5,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "8-Modern Physics Basics",
//     description: "This is a post for grade 8 ..................",

//     posted_by: "Dr. Einstein",
//     uploaded_at: "2025-09-20",
//     files: [
//       "https://arxiv.org/pdf/quant-ph/0410100.pdf", // quantum mechanics paper
//     ],
//     post_tags: ["Physics", "Quantum", "Education"],
//     post_status: "draft",
//     post_grade_avg: 4.2,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "9-Public Speaking Guide",
//     description: "This is a post for grade 8 ..................",

//     posted_by: "Ms. Johnson",
//     uploaded_at: "2025-09-15",
//     files: [
//       "https://www.gutenberg.org/files/16317/16317-pdf.pdf", // Dale Carnegie-like public domain text
//     ],
//     post_tags: ["Soft Skills", "Communication"],
//     post_status: "archived",
//     post_grade_avg: 3.9,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "10-Introduction to Algorithms",
//     description: "This is a post for grade 8 ..................",

//     posted_by: "Prof. Thomas",
//     uploaded_at: "2025-09-25",
//     files: [
//       "https://arxiv.org/pdf/2111.01147.pdf", // sample CS research paper
//       "https://www.gutenberg.org/files/84/84-pdf.pdf", // Frankenstein (public domain)
//     ],
//     post_tags: ["Algorithms", "CS", "Education"],
//     post_status: "published",
//     post_grade_avg: 4.5,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "11-Modern Physics Basics",
//     description: "This is a post for grade 8 ..................",

//     posted_by: "Dr. Einstein",
//     uploaded_at: "2025-09-20",
//     files: [
//       "https://arxiv.org/pdf/quant-ph/0410100.pdf", // quantum mechanics paper
//     ],
//     post_tags: ["Physics", "Quantum", "Education"],
//     post_status: "draft",
//     post_grade_avg: 4.2,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "12-Public Speaking Guide",
//     description: "This is a post for grade 8 ..................",

//     posted_by: "Ms. Johnson",
//     uploaded_at: "2025-09-15",
//     files: [
//       "https://www.gutenberg.org/files/16317/16317-pdf.pdf", // Dale Carnegie-like public domain text
//     ],
//     post_tags: ["Soft Skills", "Communication"],
//     post_status: "archived",
//     post_grade_avg: 3.9,
//   },
// ];

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
  console.log(userPostFeedsData?.posts);

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

  const visiblePosts = userPostFeedsData?.posts.slice(0, visiblePostsCount);
  const hasMorePosts = visiblePostsCount < userPostFeedsData?.posts.length;
  return (
    <div className="bg-[#FDFDFD] py-5.5 px-6 flex flex-col gap-5 rounded-[40px]">
      {/* left side */}
      <div className="p-6 w-full">
        {/* left top */}
        <div className="flex flex-row justify-between mb-5 flex-wrap">
          <SectionHeader
            title="Recent Uploads from Your School"
            subheader="Documents uploaded by teachers in your domain"
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
  );
}
