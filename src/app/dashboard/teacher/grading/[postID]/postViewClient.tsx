"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import { useState } from "react";
import { FilterButtons } from "@/components/ui/FilterButtons";
import PostTags from "@/modules/dashboard/teacher/PostTags";
import GradeGivenSection from "@/modules/dashboard/teacher/GradeGivenSection";
import { PostType } from "@/types/Post"; // <-- your post type
import GradeTemplateRubric from "@/modules/dashboard/teacher/GradingLogics/GradeTemplateRubric";
import { GroupedGrade } from "@/app/types/user";
import { userSinglePostData } from "@/services/user.service";
import { useUserSinglePostData } from "@/hooks/useUser";
import { timeAgo } from "@/lib/timeAgo";

// const post: PostType = {
//   id: "Dd3f32fhfvg3fvb3f",
//   title: "12-Public Speaking Guide",
//   description: "This is a post for grade 8.............",
//   createdAt: "2025-09-15",
//   uploads: [
//     {
//       id: "1",
//       fileName: "quantum.pdf",
//       fileUrl: "https://arxiv.org/pdf/quant-ph/0410100.pdf",
//     },
//     {
//       id: "2",
//       fileName: "deep-learning.pdf",
//       fileUrl: "https://arxiv.org/pdf/2111.01147.pdf",
//     },
//   ],
//   grades: [
//     {
//       id: "grade1",
//       postId: "post1",
//       gradedBy: "user1",
//       grade: "7",
//       createdAt: "2025-09-12T18:18:37.610Z",
//     },
//     {
//       id: "grade2",
//       postId: "post1",
//       gradedBy: "user2",
//       grade: "9",
//       createdAt: "2026-09-12T18:20:37.610Z",
//     },
//   ],
//   comments: [
//     {
//       id: "comment1",
//       postId: "post1",
//       commentedBy: "user1",
//       comment: "This grade reflects clarity and structure in the submission.",
//       createdAt: "2025-09-12T18:19:09.715Z",
//     },
//     {
//       id: "comment2",
//       postId: "post1",
//       commentedBy: "user2",
//       comment: "Excellent work on content, but could improve on formatting.",
//       createdAt: "2026-09-12T18:21:09.715Z",
//     },
//   ],
//   author: {
//     id: "t1",
//     name: "Ms. Johnson",
//   },
//   gradingLogic: {
//     type: "rubric", // could also be "numeric", "passFail", etc.
//     criteria: [
//       { key: "purpose", label: "Purpose", maxPoints: 10 },
//       { key: "accuracy", label: "Accuracy", maxPoints: 10 },
//       { key: "clarity", label: "Clarity", maxPoints: 10 },
//     ],
//     letterGrades: [
//       { letter: "A", min: 25, max: 30 },
//       { letter: "B", min: 15, max: 24 },
//       { letter: "C", min: 3, max: 14 },
//     ],
//     total: { min: 3, max: 30 },
//   },
//   tags: ["Soft Skills", "Communication"],
//   postStatus: "archived",
//   postGradeAvg: 3.9,
// };

export default function PostViewClient() {
  const params = useParams();

  const postId = Array.isArray(params.postID)
    ? params.postID[0]!
    : params.postID!;

  const {
    userSinglePostData: post,
    isUserSinglePostDataLoading,
    isUserSinglePostDataError,
    isUserSinglePostDataSuccess,
    isUserSinglePostError,
  } = useUserSinglePostData(postId);

  const groupedGrades: GroupedGrade[] = (post as PostType).grades.map(
    (grade) => {
      const comment = post.comments.find(
        (c: any) => c.commentedBy === grade.gradedBy
      );
      return {
        gradedBy: grade.gradedBy,
        grade: grade.grade,
        createdAt: grade.createdAt,
        comment: comment?.comment || null,
      };
    }
  );

  const { title, description, author, createdAt, uploads, tags, postGradeAvg } =
    post;

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const filters = ["Grades", "Grade Test"];
  const [activeFilter, setActiveFilter] = useState("Grades");

  const nextFile = () => {
    setCurrentFileIndex((prev) => (prev + 1) % uploads.length);
  };

  const prevFile = () => {
    setCurrentFileIndex((prev) => (prev - 1 + uploads.length) % uploads.length);
  };

  const currentFile = uploads[currentFileIndex].fileUrl;
  const ext = currentFile.split(".").pop()?.toLowerCase();

  return (
    <div className="bg-[#FDFDFD] py-5.5 px-6 rounded-[40px] grid grid-cols-2 w-full gap-16.5 min-h-screen">
      {/* LEFT SIDE */}
      <div className="flex flex-col items-start rounded-3xl gap-6">
        {/* Top */}
        <div className="flex flex-row justify-between items-start w-full">
          <div className="flex flex-row gap-3">
            <div className="mt-2 w-2 h-2 rounded-full bg-[#368FFF]"></div>
            <div className="flex flex-col gap-1 items-start">
              <p className="font-medium">{title}</p>
              <p className="text-sm text-gray-500">
                by {author.name} • {timeAgo(createdAt)}
              </p>
              <p className="mt-2">{description}</p>
            </div>
          </div>
          <div className="flex flex-row gap-1.5 items-center text-[#368FFF] cursor-pointer">
            <UserPlus size={19} />
            <p>Follow</p>
          </div>
        </div>
        {/* full file preview */}
        <div className="relative bg-gray-100 w-full rounded-3xl flex items-center justify-center overflow-hidden">
          {/* Navigation */}
          <button
            onClick={prevFile}
            className="absolute left-4 bg-white/80 p-2 rounded-full shadow hover:bg-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextFile}
            className="absolute right-4 bg-white/80 p-2 rounded-full shadow hover:bg-white"
          >
            <ChevronRight size={20} />
          </button>

          {/* File content */}
          {ext === "pdf" ? (
            <iframe src={currentFile} className="w-full h-[80vh]" />
          ) : (
            <img src={currentFile} alt="viewer" className="max-h-[80vh]" />
          )}
        </div>
        {/* Bottom tags */}
        <div className="flex flex-row gap-4 items-center">
          {tags?.map((tag: string, idx: number) => (
            <PostTags
              key={idx}
              text={tag}
              type={idx % 2 === 1 ? "colored" : undefined}
            />
          ))}
          <p className="text-sm text-gray-600">Avg: {postGradeAvg}</p>
          <p className="text-sm text-gray-600">Given Grade: C</p>
        </div>
      </div>

      {/* RIGHT SIDE – File Viewer */}
      <div className="flex flex-col items-start">
        {/* filters */}
        <div>
          <FilterButtons
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
        {/* grades given */}
        <div className="  max-h-screen overflow-y-scroll scrollbar-hide">
          {activeFilter === "Grades" &&
            groupedGrades.length > 0 &&
            groupedGrades.map((grader, idx) => (
              <GradeGivenSection
                key={idx}
                grader={grader}
                date={post.createdAt}
                authorName={post.author.name}
              />
            ))}{" "}
          {!groupedGrades.length && (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl space-y-4">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-6h6v6M12 3v4m-7 4h14m-7 4v4"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700">
                No grades yet
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Once teachers grade the submissions, you’ll see them here.
              </p>
            </div>
          )}
        </div>

        {activeFilter === "Grade Test" && (
          <div className=" mt-8 flex flex-col items-start">
            {post?.gradingLogic?.type === "rubric" && (
              <GradeTemplateRubric
                criteria={post.gradingLogic.criteria}
                totalRange={post.gradingLogic.total}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
