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
import SectionLoading from "@/components/SectionLoading";
import { GradeTemplateNumeric } from "@/modules/dashboard/teacher/GradingLogics/GradeTemplateNumeric";
import { GradeTemplateLetter } from "@/modules/dashboard/teacher/GradingLogics/GradeTemplateLetter";
import { GradeTemplateWeightedRubric } from "@/modules/dashboard/teacher/GradingLogics/GradeTemplateWeightedRubric";
import { GradeTemplatePassFail } from "@/modules/dashboard/teacher/GradingLogics/GradeTemplatePassFail";
import { GradeTemplateChecklist } from "@/modules/dashboard/teacher/GradingLogics/GradeTemplateChecklist";
import { decoded } from "@/lib/currentUser";
import AlreadyGradedNotice from "@/modules/dashboard/teacher/AlreadyGradedSection";

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

  const groupedGrades: GroupedGrade[] = (post as PostType)?.grades.map(
    (grade: any) => {
      const comment = post?.comments.find(
        (c: any) => c.commentedBy === grade.gradedBy
      );
      return {
        gradedBy: grade.grader,
        grade: grade.grade,
        createdAt: grade.createdAt,
        comment: comment?.comment || null,
      };
    }
  );
  console.log(groupedGrades, "grouped");
  const {
    title = "",
    description = "",
    author = null,
    createdAt = "",
    uploads = [],
    tags = [],
    averageGrade = 0,
    userGrade,
  } = post || {};

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const filters = ["Grades", "Grade Test"];
  const [activeFilter, setActiveFilter] = useState("Grades");
  const checkPostIsNotThisUser = author?.id === decoded?.id;
  const checkPostIsGradedByThisUser = groupedGrades?.some((grade) => {
    return grade?.gradedBy?.id === decoded?.id;
  });
  console.log(checkPostIsGradedByThisUser);

  const nextFile = () => {
    setCurrentFileIndex((prev) => (prev + 1) % uploads.length);
  };

  const prevFile = () => {
    setCurrentFileIndex((prev) => (prev - 1 + uploads.length) % uploads.length);
  };

  const currentFile = uploads[currentFileIndex]?.fileUrl;
  const ext = currentFile?.split(".").pop()?.toLowerCase();
  const givenGrade = (() => {
    switch (post?.gradingTemplate?.type) {
      case "numeric":
        return userGrade.numeric;
      case "letter":
        return userGrade.letter;
      case "rubric":
        return userGrade.rubric;
      case "passFail":
        return userGrade.passFail;
      case "checklist":
        return userGrade.checklist;
      default:
        return null;
    }
  })();

  return (
    <div className="bg-[#FDFDFD] py-5.5 px-6 rounded-[40px] grid grid-cols-2 w-full gap-16.5 min-h-screen">
      {/* LEFT SIDE */}
      {!post && <SectionLoading />}{" "}
      {post && (
        <div className="flex flex-col items-start rounded-3xl gap-6">
          {/* Top */}
          <div className="flex flex-row justify-between items-start  w-full">
            <div className="flex flex-row   gap-3 ">
              <div className="w-2"></div>
              <div className="flex flex-col gap-1 items-start">
                <div className="flex flex-col relative">
                  {" "}
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-gray-500">
                    by {post?.author.name} • {timeAgo(createdAt)}
                  </p>
                  <div className=" absolute top-2 left-[-15px] w-2 h-2 rounded-full bg-[#368FFF]"></div>
                </div>
                <p className=" mt-2.5 ">{description}</p>
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
              <img src={currentFile} alt="viewer" className="max-h-[90vh]" />
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
            <p className="text-sm text-gray-600">Avg: {averageGrade}</p>
            <p className="text-sm text-gray-600">Given Grade:{givenGrade}</p>
          </div>
        </div>
      )}
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
        <div className="max-h-screen overflow-y-scroll scrollbar-hide">
          {activeFilter === "Grades" && groupedGrades?.length > 0 && (
            <>
              {groupedGrades.map((grader, idx) => {
                const type = post?.gradingTemplate?.type;

                switch (type) {
                  case "numeric":
                    return (
                      <GradeGivenSection
                        key={idx}
                        grade={grader}
                        gradingTemplate={post?.gradingTemplate}
                      >
                        <div className="text-sm text-gray-700">
                          Score: {grader.grade.numeric}/
                          {post?.gradingTemplate.criteria.numericCriteria.max}
                        </div>
                      </GradeGivenSection>
                    );

                  // case "letter":
                  //   return (
                  //     <GradeGivenSection
                  //       key={idx}
                  //       grade={grader}
                  //       gradingTemplate={post?.gradingTemplate}
                  //     >
                  //       <div className="text-sm text-gray-700">
                  //         Grade: {grader.grade.letter}
                  //       </div>
                  //     </GradeGivenSection>
                  //   );

                  // case "rubric":
                  //   return (
                  //     <GradeGivenSection
                  //       key={idx}
                  //       grade={grader}
                  //       gradingTemplate={post?.gradingTemplate}
                  //     >
                  //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  //         {Object.entries(grader.grade.criteria || {}).map(
                  //           ([name, result], i) => (
                  //             <GradeParametersView
                  //               key={i}
                  //               name={name}
                  //               result={String(result)}
                  //             />
                  //           )
                  //         )}
                  //       </div>
                  //     </GradeGivenSection>
                  //   );

                  // case "weighted-rubric":
                  //   return (
                  //     <GradeGivenSection
                  //       key={idx}
                  //       grade={grader}
                  //       gradingTemplate={post?.gradingTemplate}
                  //     >
                  //       <div className="space-y-2">
                  //         {grader.grade.weights?.map((w: any, i: number) => (
                  //           <div key={i} className="text-sm text-gray-700">
                  //             {w.criteria}: {w.value} ({w.weight}%)
                  //           </div>
                  //         ))}
                  //       </div>
                  //     </GradeGivenSection>
                  //   );

                  // case "checklist":
                  //   return (
                  //     <GradeGivenSection
                  //       key={idx}
                  //       grade={grader}
                  //       gradingTemplate={post?.gradingTemplate}
                  //     >
                  //       <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
                  //         {grader.grade.items?.map(
                  //           (item: string, i: number) => (
                  //             <li key={i}>{item}</li>
                  //           )
                  //         )}
                  //       </ul>
                  //     </GradeGivenSection>
                  //   );

                  // case "passfail":
                  //   return (
                  //     <GradeGivenSection
                  //       key={idx}
                  //       grade={grader}
                  //       gradingTemplate={post?.gradingTemplate}
                  //     >
                  //       <div
                  //         className={`px-3 py-1 rounded-full text-sm font-medium ${
                  //           grader.grade.pass
                  //             ? "bg-green-100 text-green-700"
                  //             : "bg-red-100 text-red-700"
                  //         }`}
                  //       >
                  //         {grader.grade.pass ? "Passed" : "Failed"}
                  //       </div>
                  //     </GradeGivenSection>
                  //   );

                  default:
                    return null;
                }
              })}
            </>
          )}

          {activeFilter === "Grades" && !groupedGrades?.length && (
            <div className="flex flex-col items-center justify-center mt-8 py-16 px-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl space-y-4">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
                Once teachers grade the submissions, you’ll see them here. Be
                the first one to grade this test 🙂
              </p>
            </div>
          )}
        </div>

        {activeFilter === "Grade Test" && !checkPostIsNotThisUser && (
          <>
            {/* Show grading section if NOT graded */}
            {!checkPostIsGradedByThisUser && (
              <div className="mt-8 flex flex-col items-start w-full">
                {post?.gradingTemplate?.type === "rubric" && (
                  <GradeTemplateRubric
                    criteria={post?.gradingTemplate.criteria}
                    totalRange={post?.gradingTemplate.criteria.total}
                  />
                )}

                {post?.gradingTemplate?.type === "numeric" && (
                  <GradeTemplateNumeric
                    label="Score"
                    min={post?.gradingTemplate.criteria.numericCriteria.min}
                    max={post?.gradingTemplate.criteria.numericCriteria.max}
                    gradingTemplate={post?.gradingTemplate}
                    postId={postId}
                  />
                )}

                {post?.gradingTemplate?.type === "letter" && (
                  <GradeTemplateLetter
                    ranges={post?.gradingTemplate.criteria.letterRanges}
                    gradingTemplate={post?.gradingTemplate}
                    postId={postId}
                  />
                )}
              </div>
            )}

            {/* Show "Already graded" notice if graded */}
            {checkPostIsGradedByThisUser && (
              <AlreadyGradedNotice onEdit={() => {}} />
            )}
          </>
        )}

        {/* {post?.gradingTemplate?.type === "letter" && (
              <GradeTemplateLetter />
            )}
            {post?.gradingTemplate?.type === "weightedRubric" && (
              <GradeTemplateWeightedRubric />
            )}
            {post?.gradingTemplate?.type === "passFail" && (
              <GradeTemplatePassFail />
            )}

            {post?.gradingTemplate?.type === "checklist" && (
              <GradeTemplateChecklist />
            )} */}
      </div>
    </div>
  );
}
