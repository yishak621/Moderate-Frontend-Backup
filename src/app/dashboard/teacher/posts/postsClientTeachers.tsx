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

const options = [
  { value: "all", label: "All" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
];

export const samplePosts: PostAttributes[] = [
  {
    id: "Dd3f32fhfvg3fvb3f",
    name_of_post: "1-Introduction to Algorithms",
    description: "This is a post for grade 8 ..................",
    posted_by: "Prof. Thomas",
    uploaded_at: "2025-09-25",
    files: [
      "https://arxiv.org/pdf/2111.01147.pdf", // sample CS research paper
      "https://www.gutenberg.org/files/84/84-pdf.pdf", // Frankenstein (public domain)
    ],
    post_tags: ["Algorithms", "CS", "Education"],
    post_status: "published",
    post_grade_avg: 4.5,
  },
  {
    id: "Dd3f32fhfvg3fvb3f",
    name_of_post: "1-Introduction to Algorithms",
    description: "This is a post for grade 8 ..................",
    posted_by: "Prof. Thomas",
    uploaded_at: "2025-09-25",
    files: [
      "https://arxiv.org/pdf/2111.01147.pdf", // sample CS research paper
      "https://www.gutenberg.org/files/84/84-pdf.pdf", // Frankenstein (public domain)
    ],
    post_tags: ["Algorithms", "CS", "Education"],
    post_status: "published",
    post_grade_avg: 4.5,
  },
  {
    id: "Dd3f32fhfvg3fvb3f",
    name_of_post: "1-Introduction to Algorithms",
    description: "This is a post for grade 8 ..................",
    posted_by: "Prof. Thomas",
    uploaded_at: "2025-09-25",
    files: [
      "https://arxiv.org/pdf/2111.01147.pdf", // sample CS research paper
      "https://www.gutenberg.org/files/84/84-pdf.pdf", // Frankenstein (public domain)
    ],
    post_tags: ["Algorithms", "CS", "Education"],
    post_status: "published",
    post_grade_avg: 4.5,
  },
  {
    id: "Dd3f32fhfvg3fvb3f",
    name_of_post: "1-Introduction to Algorithms",
    description: "This is a post for grade 8 ..................",
    posted_by: "Prof. Thomas",
    uploaded_at: "2025-09-25",
    files: [
      "https://arxiv.org/pdf/2111.01147.pdf", // sample CS research paper
      "https://www.gutenberg.org/files/84/84-pdf.pdf", // Frankenstein (public domain)
    ],
    post_tags: ["Algorithms", "CS", "Education"],
    post_status: "published",
    post_grade_avg: 4.5,
  },

  {
    id: "Dd3f32fhfvg3fvb3f",
    name_of_post: "3-Public Speaking Guide",
    description: "This is a post for grade 8 ..................",

    posted_by: "Ms. Johnson",
    uploaded_at: "2025-09-15",
    files: [
      "https://www.gutenberg.org/files/16317/16317-pdf.pdf", // Dale Carnegie-like public domain text
    ],
    post_tags: ["Soft Skills", "Communication"],
    post_status: "archived",
    post_grade_avg: 3.9,
  },

  {
    id: "Dd3f32fhfvg3fvb3f",
    name_of_post: "5-Modern Physics Basics",
    description: "This is a post for grade 8 ..................",

    posted_by: "Dr. Einstein",
    uploaded_at: "2025-09-20",
    files: [
      "https://arxiv.org/pdf/quant-ph/0410100.pdf", // quantum mechanics paper
    ],
    post_tags: ["Physics", "Quantum", "Education"],
    post_status: "draft",
    post_grade_avg: 4.2,
  },

  {
    id: "Dd3f32fhfvg3fvb3f",
    name_of_post: "7-Introduction to Algorithms",
    description: "This is a post for grade 8 ..................",

    posted_by: "Prof. Thomas",
    uploaded_at: "2025-09-25",
    files: [
      "https://arxiv.org/pdf/2111.01147.pdf", // sample CS research paper
      "https://www.gutenberg.org/files/84/84-pdf.pdf", // Frankenstein (public domain)
    ],
    post_tags: ["Algorithms", "CS", "Education"],
    post_status: "published",
    post_grade_avg: 4.5,
  },

  {
    id: "Dd3f32fhfvg3fvb3f",
    name_of_post: "10-Introduction to Algorithms",
    description: "This is a post for grade 8 ..................",

    posted_by: "Prof. Thomas",
    uploaded_at: "2025-09-25",
    files: [
      "https://arxiv.org/pdf/2111.01147.pdf", // sample CS research paper
      "https://www.gutenberg.org/files/84/84-pdf.pdf", // Frankenstein (public domain)
    ],
    post_tags: ["Algorithms", "CS", "Education"],
    post_status: "published",
    post_grade_avg: 4.5,
  },
];

export default function PostsClientTeachers() {
  const filters = ["All", "Moderated", "Pending"];
  const [activeFilter, setActiveFilter] = useState("Pending"); // ✅ default "All"
  const [visiblePostsCount, setVisiblePostsCount] = useState(5); // Start with 5 posts
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSelect = (
    selected: { value: string | boolean; label: string } | null
  ) => {
    console.log("Selected option:", selected);
  };
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

  const visiblePosts = samplePosts.slice(0, visiblePostsCount);
  const hasMorePosts = visiblePostsCount < samplePosts.length;
  return (
    <div className="bg-[#FDFDFD] py-11 px-6 rounded-[40px] flex flex-col">
      {/* top section */}
      <div className=" flex flex-row justify-between items-center">
        <h4 className="text-[#0C0C0C] text-xl font-medium">My Posts</h4>

        <div className="flex flex-row gap-1.5 items-center">
          <div>
            <FilterButtons
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
          <div className="min-w-[200px]">
            <CustomSelect
              options={options}
              placeholder="Select a subject"
              onChange={handleSelect}
              defaultValue={options[0]}
            />
          </div>
        </div>
      </div>

      {/* Create New Post Section */}
      <div className="mt-6 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
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
          {visiblePosts.map((post, idx) => {
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

      {/* Create Post Modal */}
      {/* VERY IMPORTANT */}
      <Modal isOpen={open} onOpenChange={setOpen}>
        <Modal.Content>
          <CreatPostModal />
          {/* render dynamic component */}
        </Modal.Content>
      </Modal>
    </div>
  );
}
