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
import GradeTemplateWeightedRubric from "@/modules/dashboard/teacher/GradingLogics/GradeTemplateWeightedRubric";
import { GradeTemplatePassFail } from "@/modules/dashboard/teacher/GradingLogics/GradeTemplatePassFail";
import { GradeTemplateChecklist } from "@/modules/dashboard/teacher/GradingLogics/GradeTemplateChecklist";
import { decoded } from "@/lib/currentUser";
import AlreadyGradedNotice from "@/modules/dashboard/teacher/AlreadyGradedSection";
import MobilePostView from "./MobilePostView";
import { ensureHttps } from "@/lib/urlHelpers";
import Image from "next/image";

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
    gradingTemplate,
  } = post || {};

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const filters = ["Grades", "Grade Test"];
  const [activeFilter, setActiveFilter] = useState("Grades");
  const checkPostIsNotThisUser = author?.id === decoded?.id;
  const checkPostIsGradedByThisUser = groupedGrades?.some((grade) => {
    return grade?.gradedBy?.id === decoded?.id;
  });
  console.log(groupedGrades, "grades");

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
        return userGrade?.numeric;
      case "letter":
        return userGrade?.letter;
      case "rubric":
        const rubricMaxScore =
          gradingTemplate?.criteria?.rubricCriteria?.reduce(
            (sum: number, c: any) => sum + c.maxPoints,
            0
          );
        return `${userGrade?.rubric.reduce(
          (acc: number, val: any) => acc + Number(val),
          0
        )}/${rubricMaxScore}`;
      case "passFail":
        return userGrade?.passFail;
      case "checklist":
        return userGrade?.checklist;
      default:
        return null;
    }
  })();

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        {!post && <SectionLoading />}
        {post && (
          <MobilePostView
            post={post as PostType}
            groupedGrades={groupedGrades}
          />
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid bg-[#FDFDFD] py-5.5 px-6 rounded-[40px] grid-cols-2 w-full gap-16.5 min-h-screen">
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
                <iframe
                  src={`${ensureHttps(currentFile)}#toolbar=0`}
                  className="w-full h-[80vh]"
                  loading="lazy"
                  allow="fullscreen"
                />
              ) : (
                <Image
                  width={100}
                  height={100}
                  src={currentFile}
                  alt="viewer"
                  className="max-h-[90vh]"
                />
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
          <div className="max-h-screen overflow-y-scroll scrollbar-hide w-full">
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
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div>
                              <p className="text-sm text-gray-600">Score</p>
                              <p className="text-base font-semibold text-gray-800">
                                {grader.grade.numeric} /{" "}
                                {
                                  post?.gradingTemplate.criteria.numericCriteria
                                    .max
                                }
                              </p>
                            </div>

                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 font-semibold text-lg">
                              {Math.round(
                                (grader.grade.numeric /
                                  post?.gradingTemplate.criteria.numericCriteria
                                    .max) *
                                  100
                              )}
                              %
                            </div>
                          </div>
                        </GradeGivenSection>
                      );

                    case "letter":
                      return (
                        <GradeGivenSection
                          key={idx}
                          grade={grader}
                          gradingTemplate={post?.gradingTemplate}
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg">
                                {grader?.grade.letter.letterGrade.letter}
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Grade</p>
                                <p className="text-base font-semibold text-gray-800">
                                  {grader?.grade.letter.letterGrade.letter}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-600">Score</p>
                              <p className="text-base font-semibold text-gray-800">
                                {grader?.grade.letter.score}
                              </p>
                            </div>
                          </div>
                        </GradeGivenSection>
                      );

                    case "rubric":
                      return (
                        <GradeGivenSection
                          key={idx}
                          grade={grader}
                          gradingTemplate={post?.gradingTemplate}
                        >
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <p className="text-sm font-semibold text-gray-800 mb-3">
                              Rubric Breakdown
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {Array.isArray(
                                grader?.grade?.rubric?.rubricData
                              ) &&
                                grader.grade.rubric.rubricData.map(
                                  (
                                    item: { label: string; value: string },
                                    i: number
                                  ) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm"
                                    >
                                      <span className="text-sm font-medium text-gray-700">
                                        {item.label}
                                      </span>
                                      <span className="text-sm font-semibold text-blue-600">
                                        {item.value}
                                      </span>
                                    </div>
                                  )
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-600">
                                Total Score
                              </p>
                              <p className="text-base font-bold text-gray-800">
                                {grader?.grade?.rubric?.totalScore ?? 0}
                              </p>
                            </div>

                            <p className="text-xs text-gray-500 mt-1">
                              Overall Percentage:{" "}
                              <span className="font-semibold text-blue-600">
                                {grader?.grade?.rubric?.percentage ?? 0}%
                              </span>
                            </p>
                          </div>
                        </GradeGivenSection>
                      );

                    case "weightedRubric":
                      return (
                        <GradeGivenSection
                          key={idx}
                          grade={grader}
                          gradingTemplate={post?.gradingTemplate}
                        >
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <p className="text-lg font-semibold text-gray-800 mb-4">
                              Weighted Rubric Breakdown
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {Array.isArray(
                                grader?.grade?.weightedRubric?.rubricData
                              ) &&
                                grader.grade.weightedRubric.rubricData.map(
                                  (w: any, i: number) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm hover:bg-gray-50 transition-colors"
                                    >
                                      <span className="text-sm font-medium text-gray-700">
                                        {w.label}
                                      </span>
                                      <span className="text-sm font-semibold text-blue-600">
                                        {w.value} ({w.weight}%)
                                      </span>
                                    </div>
                                  )
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200">
                              <p className="text-sm text-gray-600">
                                Total Score
                              </p>
                              <p className="text-base font-bold text-gray-800">
                                {grader?.grade?.weightedRubric?.totalScore ?? 0}
                              </p>
                            </div>

                            <p className="text-xs text-gray-500 mt-1">
                              Overall Percentage:{" "}
                              <span className="font-semibold text-blue-600">
                                {grader?.grade?.weightedRubric?.percentage ?? 0}
                                %
                              </span>
                            </p>
                          </div>
                        </GradeGivenSection>
                      );

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
                      gradingTemplate={post?.gradingTemplate}
                      postId={postId}
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

                  {post?.gradingTemplate?.type === "weightedRubric" && (
                    <GradeTemplateWeightedRubric
                      criteria={post?.gradingTemplate.criteria}
                      totalRange={post?.gradingTemplate.criteria.total}
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
    </>
  );
}
