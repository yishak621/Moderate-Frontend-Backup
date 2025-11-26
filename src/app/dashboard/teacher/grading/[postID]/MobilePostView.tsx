"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  MoreVertical,
  Edit3,
  BarChart3,
  Trash2,
  Flag,
  MessagesSquare,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PostType } from "@/types/Post";
import { GroupedGrade } from "@/app/types/user";
import PostTags from "@/modules/dashboard/teacher/PostTags";
import GradeGivenSection from "@/modules/dashboard/teacher/GradeGivenSection";
import { timeAgo } from "@/lib/timeAgo";
import { GradeTemplateNumeric } from "@/modules/dashboard/teacher/GradingLogics/GradeTemplateNumeric";
import { GradeTemplateLetter } from "@/modules/dashboard/teacher/GradingLogics/GradeTemplateLetter";
import GradeTemplateWeightedRubric from "@/modules/dashboard/teacher/GradingLogics/GradeTemplateWeightedRubric";
import { GradeTemplatePassFail } from "@/modules/dashboard/teacher/GradingLogics/GradeTemplatePassFail";
import { GradeTemplateChecklist } from "@/modules/dashboard/teacher/GradingLogics/GradeTemplateChecklist";
import GradeTemplateRubric from "@/modules/dashboard/teacher/GradingLogics/GradeTemplateRubric";
import { decoded } from "@/lib/currentUser";
import AlreadyGradedNotice from "@/modules/dashboard/teacher/AlreadyGradedSection";
import Image from "next/image";
import PopupCard from "@/components/PopCard";
import BottomSheet from "@/components/ui/BottomSheet";
import EditPostModal from "@/modules/dashboard/teacher/post/EditPostModal";
import DeletePostModal from "@/modules/dashboard/teacher/post/DeletePostModal";
import ViewStatPostModal from "@/modules/dashboard/teacher/post/ViewDetailPostModal";
import { ensureHttps } from "@/lib/urlHelpers";
import { useUserDeleteGrade } from "@/hooks/useUser";
import toast from "react-hot-toast";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
import DeleteGradeModal from "@/modules/dashboard/teacher/DeleteGradeModal";
import { useGradeEditStore } from "@/store/gradeEditStore";
import ReportUserModal from "@/modules/dashboard/teacher/modal/ReportUserModal";
import { User } from "@/app/types/user";
import UserActionsMenu from "@/components/UserActionsMenu";
import ImageViewer from "@/components/ui/ImageViewer";
import ImageAnnotationOverlay from "@/components/ImageAnnotationOverlay";
import PdfAnnotationOverlay from "@/components/PdfAnnotationOverlay";

interface MobilePostViewProps {
  post: PostType & {
    averageGrade?: number;
    userGrade?: any;
    gradingTemplate?: any;
  };
  groupedGrades: GroupedGrade[];
  isFollowingAuthor?: boolean;
  onFollowAuthor?: () => void;
  isFollowLoading?: boolean;
}

type TabType = "documents" | "grades" | "gradeTest";

export default function MobilePostView({
  post,
  groupedGrades,
  isFollowingAuthor = false,
  onFollowAuthor,
  isFollowLoading = false,
}: MobilePostViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("documents");
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalComponent, setModalComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPdfFullScreenOpen, setIsPdfFullScreenOpen] = useState(false);

  const postData = post as any;

  // Use Zustand store for grade edit state
  const { isEditingGrade: isEditingGradeInStore, setEditingGrade } =
    useGradeEditStore();
  // Get post ID from postData to ensure consistency
  const postId = postData?.id || post?.id || "";
  const isEditingGrade = isEditingGradeInStore(postId);
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
  } = postData || {};

  const { deleteGradeAsync } = useUserDeleteGrade();

  const checkPostIsNotThisUser = author?.id === decoded?.id;
  const checkPostIsGradedByThisUser = groupedGrades?.some(
    (grade) => grade?.gradedBy?.id === decoded?.id
  );
  const isCurrentUserPost = author?.id === decoded?.id;

  // Find current user's grade
  const currentUserGrade = (post as any)?.grades?.find(
    (grade: any) => grade.gradedBy === decoded?.id
  );

  // Extract existing grade data for editing
  const existingGradeData = currentUserGrade
    ? (() => {
        const gradeType = gradingTemplate?.type;
        const gradeData: any = currentUserGrade.grade || {};
        const existingComment = groupedGrades?.find(
          (g) => g.gradedBy?.id === decoded?.id
        );
        const comment = existingComment?.comment || "";

        // Find the comment ID from post.comments
        const commentObj = postData?.comments?.find(
          (c: any) => c.commentedBy === currentUserGrade.gradedBy
        );
        const commentId = commentObj?.id;

        switch (gradeType) {
          case "numeric":
            return {
              defaultValue: Number(gradeData.numeric) || 0,
              defaultComment: comment || "",
              commentId: commentId,
              gradeId: currentUserGrade.id,
            };
          case "letter":
            return {
              defaultValue: Number(gradeData.letter?.score) || 0,
              defaultComment: comment || "",
              commentId: commentId,
              gradeId: currentUserGrade.id,
            };
          case "rubric":
          case "weightedRubric":
            const rubricData = gradeData.rubric || gradeData.weightedRubric;
            const defaultCriteria: Record<string, number> = {};
            if (rubricData?.rubricData) {
              rubricData.rubricData.forEach((item: any) => {
                defaultCriteria[item.label] = Number(item.value) || 0;
              });
            }
            return {
              defaultCriteria,
              defaultComment: comment || "",
              commentId: commentId,
              gradeId: currentUserGrade.id,
            };
          case "checklist":
            return {
              defaultCheckedItems: gradeData.checklist?.items || [],
              defaultComment: comment || "",
              commentId: commentId,
              gradeId: currentUserGrade.id,
            };
          case "passFail":
            return {
              defaultPass: gradeData.passFail?.pass ?? null,
              defaultComment: comment || "",
              commentId: commentId,
              gradeId: currentUserGrade.id,
            };
          default:
            return {
              commentId: commentId,
              gradeId: currentUserGrade.id,
            };
        }
      })()
    : {};

  const currentUserCommentId = (existingGradeData as any)?.commentId as
    | string
    | undefined;

  const handleEditGrade = () => {
    setActiveTab("gradeTest");
    setEditingGrade(postId, true);
  };

  const handleDeleteGrade = () => {
    if (!currentUserGrade?.id) {
      toast.error("Grade ID not found");
      return;
    }
    if (!currentUserCommentId) {
      toast.error("Comment reference not found for this grade.");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const handleOpenModal = <P,>(
    component: React.ComponentType<P>,
    props?: P
  ) => {
    setModalComponent(() => component);
    setModalProps(props || {});
    setIsModalOpen(true);
  };

  const handleActionSelect = (action: string) => {
    setIsMenuOpen(false);
    switch (action) {
      case "edit":
        handleOpenModal(EditPostModal, { post: postData });
        break;
      case "stats":
        handleOpenModal(ViewStatPostModal, { post: postData });
        break;
      case "delete":
        handleOpenModal(DeletePostModal, { post: postData });
        break;
      case "follow":
        if (
          !isCurrentUserPost &&
          !isFollowingAuthor &&
          onFollowAuthor &&
          !isFollowLoading
        ) {
          onFollowAuthor();
        }
        break;
      case "message":
        router.push(`/dashboard/teacher/messages?chatId=${author?.id}`);
        break;
      case "report":
        if (author) {
          handleOpenModal(ReportUserModal, { reportedUser: author as User });
        }
        break;
      default:
        break;
    }
  };

  const nextFile = () => {
    setCurrentFileIndex((prev) => (prev + 1) % uploads.length);
  };

  const prevFile = () => {
    setCurrentFileIndex((prev) => (prev - 1 + uploads.length) % uploads.length);
  };

  const currentUpload = uploads[currentFileIndex];
  const currentFile = currentUpload?.fileUrl;
  const currentUploadId =
    currentUpload?.id !== undefined ? String(currentUpload.id) : undefined;
  const ext = currentFile?.split(".").pop()?.toLowerCase();

  // Image Viewer
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [imageViewerSrc, setImageViewerSrc] = useState<string | null>(null);
  const openImageViewer = (src: string | null) => {
    if (!src) return;
    setImageViewerSrc(src);
    setIsImageViewerOpen(true);
  };
  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setTimeout(() => setImageViewerSrc(null), 150);
  };
  const canViewImageAnnotations =
    Boolean(decoded?.role === "TEACHER") || isCurrentUserPost;
  const canCreateImageAnnotations =
    Boolean(decoded?.role === "TEACHER") || isCurrentUserPost;

  const givenGrade = (() => {
    switch (gradingTemplate?.type) {
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

  const tabs = [
    { id: "documents" as TabType, label: "Documents" },
    { id: "grades" as TabType, label: "Grades" },
    { id: "gradeTest" as TabType, label: "Grade Test" },
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-30 bg-[#FDFDFD] border-b border-gray-200 rounded-[27px]">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-[#0C0C0C] truncate">
              {title}
            </h1>
            <p className="text-xs text-[#717171]">
              by {checkPostIsNotThisUser ? "You" : author?.name} •{" "}
              {timeAgo(createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>
              <PopupCard
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                align="right"
              >
                <div className="flex flex-col">
                  {isCurrentUserPost ? (
                    <>
                      <button
                        onClick={() => handleActionSelect("edit")}
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                          <Edit3 size={18} />
                        </span>
                        <span className="flex-1 text-left leading-snug wrap-break-word">
                          Edit Post
                        </span>
                      </button>
                      <button
                        onClick={() => handleActionSelect("stats")}
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                          <BarChart3 size={18} />
                        </span>
                        <span className="flex-1 text-left leading-snug wrap-break-word">
                          View Stats
                        </span>
                      </button>
                      <button
                        onClick={() => handleActionSelect("delete")}
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                          <Trash2 size={18} />
                        </span>
                        <span className="flex-1 text-left leading-snug wrap-break-word">
                          Delete Post
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      {author && (
                        <button
                          disabled={isFollowLoading || !onFollowAuthor}
                          onClick={() => handleActionSelect("follow")}
                          className="flex items-start gap-3 px-4 py-3 cursor-pointer rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-60"
                        >
                          <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                            <UserPlus size={18} />
                          </span>
                          <span className="flex-1 text-left leading-snug wrap-break-word">
                            {isFollowingAuthor ? "Unfollow" : "Follow"}{" "}
                            {author?.name?.split(" ")[0] || "User"}
                          </span>
                        </button>
                      )}
                      <button
                        onClick={() => handleActionSelect("message")}
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                          <MessagesSquare size={18} />
                        </span>
                        <span className="flex-1 text-left leading-snug wrap-break-word">
                          Message {author?.name?.split(" ")[0] || "User"}
                        </span>
                      </button>
                      <button
                        onClick={() => handleActionSelect("report")}
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                          <Flag size={18} />
                        </span>
                        <span className="flex-1 text-left leading-snug wrap-break-word">
                          Report Flag User
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </PopupCard>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 px-4 relative">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? "text-[#0C0C0C] font-semibold"
                  : "text-[#717171]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0C0C0C]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content with Animations */}
      <div className="py-4 space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === "documents" && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FDFDFD] rounded-[27px] p-4 space-y-4 w-full"
            >
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold text-[#0C0C0C]">
                  {title}
                </p>
                {/* Description */}

                <p className="text-sm text-[#0C0C0C] leading-relaxed">
                  {description}
                </p>
              </div>

              {/* File Navigation - Between description and image */}
              {uploads.length > 1 && (
                <div className="flex items-center justify-between gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                  <button
                    onClick={prevFile}
                    disabled={currentFileIndex === 0}
                    className="group flex items-center justify-center w-12 h-12 rounded-xl bg-[#F6F7FB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
                    aria-label="Previous file"
                  >
                    <ChevronLeft
                      size={20}
                      className="text-[#1D4ED8] group-hover:text-white transition-colors duration-200"
                    />
                  </button>

                  <div className="flex-1 flex items-center justify-center gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#F6F7FB] rounded-xl">
                      <span className="text-sm font-semibold text-[#1D4ED8]">
                        {currentFileIndex + 1}
                      </span>
                      <span className="text-sm text-gray-400">/</span>
                      <span className="text-sm font-medium text-gray-600">
                        {uploads.length}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={nextFile}
                    disabled={currentFileIndex === uploads.length - 1}
                    className="group flex items-center justify-center w-12 h-12 rounded-xl bg-[#F6F7FB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
                    aria-label="Next file"
                  >
                    <ChevronRight
                      size={20}
                      className="text-[#1D4ED8] group-hover:text-white transition-colors duration-200"
                    />
                  </button>
                </div>
              )}

              {/* File Preview */}
              <div className="relative w-full">
                {/* Image container */}
                <div className="relative bg-gray-100 rounded-[24.5px] overflow-hidden">
                  {/* File Viewer */}
                  {!currentFile ? (
                    <div className="flex items-center justify-center w-full h-[60vh] text-sm text-gray-500">
                      File preview unavailable.
                    </div>
                  ) : ext === "pdf" ? (
                    <>
                      <div className="absolute top-3 right-3 z-20">
                        <button
                          type="button"
                          onClick={() => setIsPdfFullScreenOpen(true)}
                          className="rounded-full bg-black/60 text-white text-[11px] px-3 py-1.5 flex items-center gap-1 shadow-md active:scale-95 transition"
                        >
                          <span className="w-2 h-2 border border-white rounded-[3px]" />
                          <span>Full screen</span>
                        </button>
                      </div>
                      <PdfAnnotationOverlay
                        postId={postId}
                        uploadId={currentUploadId}
                        fileUrl={ensureHttps(currentFile)}
                        canCreateAnnotations={canCreateImageAnnotations}
                        variant="mobile"
                      />
                    </>
                  ) : (
                    <ImageAnnotationOverlay
                      postId={postId}
                      uploadId={currentUploadId}
                      imageUrl={currentFile}
                      canCreateAnnotations={canCreateImageAnnotations}
                      onOpenImageViewer={() => openImageViewer(currentFile)}
                      variant="mobile"
                    />
                  )}
                </div>
              </div>

              {/* Tags & Stats */}
              <div className="flex flex-wrap gap-2 items-center">
                {tags?.map((tag: string, idx: number) => (
                  <PostTags
                    key={idx}
                    text={tag}
                    type={idx % 2 === 1 ? "colored" : undefined}
                  />
                ))}
              </div>

              <div className="flex gap-4 text-sm">
                <div className="bg-blue-50 px-3 py-2 rounded-full">
                  <span className="text-blue-700 font-medium">
                    Avg: {averageGrade}
                  </span>
                </div>
                {givenGrade && (
                  <div className="bg-green-50 px-3 py-2 rounded-full">
                    <span className="text-green-700 font-medium">
                      Given Grade: {givenGrade}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "grades" && (
            <motion.div
              key="grades"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {groupedGrades?.length > 0 && (
                <>
                  {groupedGrades.map((grader, idx) => {
                    const type = gradingTemplate?.type;

                    switch (type) {
                      case "numeric":
                        return (
                          <GradeGivenSection
                            key={idx}
                            grade={grader}
                            gradingTemplate={gradingTemplate}
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#FDFDFD] border border-gray-200 rounded-[24.5px] px-4 py-4 shadow-sm">
                              <div>
                                <p className="text-sm text-gray-600">Score</p>
                                <p className="text-base font-semibold text-gray-800">
                                  {grader.grade.numeric} /{" "}
                                  {
                                    gradingTemplate?.criteria?.numericCriteria
                                      ?.max
                                  }
                                </p>
                              </div>

                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 font-semibold text-lg">
                                {Math.round(
                                  (grader.grade.numeric /
                                    (gradingTemplate?.criteria?.numericCriteria
                                      ?.max || 1)) *
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
                            gradingTemplate={gradingTemplate}
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#FDFDFD] border border-gray-200 rounded-[24.5px] px-4 py-4 shadow-sm">
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
                                  {grader?.grade.letter.letterGrade.totalScore}{" "}
                                  / {grader?.grade.letter.letterGrade.maxScore}
                                </p>
                              </div>

                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg">
                                {Math.round(
                                  grader?.grade.letter.letterGrade.percent || 0
                                )}
                                %
                              </div>
                            </div>
                          </GradeGivenSection>
                        );

                      case "rubric":
                        return (
                          <GradeGivenSection
                            key={idx}
                            grade={grader}
                            gradingTemplate={gradingTemplate}
                          >
                            <div className="bg-[#FDFDFD] border border-gray-200 rounded-[24.5px] p-4 shadow-sm">
                              <p className="text-sm font-semibold text-gray-800 mb-3">
                                Rubric Breakdown
                              </p>

                              <div className="grid grid-cols-1 gap-3">
                                {Array.isArray(
                                  grader?.grade?.rubric?.rubricData
                                ) &&
                                  grader.grade.rubric.rubricData.map(
                                    (
                                      item: { label: string; value: string },
                                      i: number
                                    ) => {
                                      // Find maxPoints from grading template criteria
                                      const criterion =
                                        gradingTemplate?.criteria?.rubricCriteria?.find(
                                          (c: any) => c.label === item.label
                                        );
                                      const maxPoints =
                                        criterion?.maxPoints ?? 0;

                                      return (
                                        <div
                                          key={i}
                                          className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm"
                                        >
                                          <span className="text-sm font-medium text-gray-700">
                                            {item.label}
                                          </span>
                                          <span className="text-sm font-semibold text-blue-600">
                                            {item.value} / {maxPoints}
                                          </span>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>

                              {/* Calculate max total score from criteria */}
                              {(() => {
                                const maxTotalScore =
                                  gradingTemplate?.criteria?.rubricCriteria?.reduce(
                                    (sum: number, c: any) =>
                                      sum + (c.maxPoints || 0),
                                    0
                                  ) || 0;
                                const totalScore =
                                  grader?.grade?.rubric?.totalScore ?? 0;
                                const percentage =
                                  typeof grader?.grade?.rubric?.percentage ===
                                  "number"
                                    ? grader.grade.rubric.percentage
                                    : parseFloat(
                                        grader?.grade?.rubric?.percentage || "0"
                                      );

                                return (
                                  <div className="mt-5 pt-4 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          Total Score
                                        </p>
                                        <p className="text-lg font-bold text-gray-800">
                                          {totalScore} / {maxTotalScore}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <div className="text-right">
                                          <p className="text-xs text-gray-500">
                                            Percentage
                                          </p>
                                          <p className="text-base font-semibold text-blue-600">
                                            {percentage.toFixed(2)}%
                                          </p>
                                        </div>
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-semibold text-base">
                                          {Math.round(percentage)}%
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </GradeGivenSection>
                        );

                      case "weightedRubric":
                        return (
                          <GradeGivenSection
                            key={idx}
                            grade={grader}
                            gradingTemplate={gradingTemplate}
                          >
                            <div className="bg-[#FDFDFD] border border-gray-200 rounded-[24.5px] p-4 shadow-sm">
                              <p className="text-sm font-semibold text-gray-800 mb-3">
                                Weighted Rubric Breakdown
                              </p>

                              <div className="grid grid-cols-1 gap-3">
                                {Array.isArray(
                                  grader?.grade?.weightedRubric?.rubricData
                                ) &&
                                  grader.grade.weightedRubric.rubricData.map(
                                    (w: any, i: number) => {
                                      // Find maxPoints from grading template criteria if not in data
                                      const criterion =
                                        gradingTemplate?.criteria?.rubricCriteria?.find(
                                          (c: any) => c.label === w.label
                                        );
                                      const maxPoints =
                                        w.maxPoints ??
                                        criterion?.maxPoints ??
                                        0;

                                      return (
                                        <div
                                          key={i}
                                          className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm"
                                        >
                                          <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-700">
                                              {w.label}
                                            </span>
                                            {w.weight && (
                                              <span className="text-xs text-gray-500 mt-0.5">
                                                Weight: {w.weight}%
                                              </span>
                                            )}
                                          </div>
                                          <span className="text-sm font-semibold text-blue-600">
                                            {w.value} / {maxPoints}
                                          </span>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>

                              {/* Calculate max total score from weights */}
                              {(() => {
                                // For weighted rubric, max score is sum of all weights
                                const maxTotalScore =
                                  gradingTemplate?.criteria?.rubricCriteria?.reduce(
                                    (sum: number, c: any) =>
                                      sum + (c.weight || 0),
                                    0
                                  ) || 0;
                                const totalScore =
                                  grader?.grade?.weightedRubric?.totalScore ??
                                  0;
                                const percentage =
                                  typeof grader?.grade?.weightedRubric
                                    ?.percentage === "number"
                                    ? grader.grade.weightedRubric.percentage
                                    : parseFloat(
                                        grader?.grade?.weightedRubric
                                          ?.percentage || "0"
                                      );

                                return (
                                  <div className="mt-5 pt-4 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          Total Score
                                        </p>
                                        <p className="text-lg font-bold text-gray-800">
                                          {totalScore.toFixed(2)} /{" "}
                                          {maxTotalScore}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <div className="text-right">
                                          <p className="text-xs text-gray-500">
                                            Percentage
                                          </p>
                                          <p className="text-base font-semibold text-blue-600">
                                            {percentage.toFixed(2)}%
                                          </p>
                                        </div>
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-semibold text-base">
                                          {Math.round(percentage)}%
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </GradeGivenSection>
                        );

                      case "checklist":
                        const checklistGrade = grader.grade?.checklist;
                        const checklistItems = checklistGrade?.items || [];
                        const checklistTotal = checklistGrade?.totalScore || 0;
                        const checklistMax = checklistGrade?.maxScore || 0;
                        const checklistPercent =
                          checklistGrade?.percentage || 0;

                        return (
                          <GradeGivenSection
                            key={idx}
                            grade={grader}
                            gradingTemplate={gradingTemplate}
                          >
                            <div className="bg-[#FDFDFD] border border-gray-200 rounded-[24.5px] p-4 shadow-sm">
                              <p className="text-sm font-semibold text-gray-800 mb-3">
                                Checklist
                              </p>

                              <div className="flex flex-col gap-2">
                                {checklistItems.length > 0 ? (
                                  <ul className="space-y-2">
                                    {checklistItems.map(
                                      (item: string, i: number) => (
                                        <li
                                          key={i}
                                          className="flex items-center gap-2 text-sm text-gray-700"
                                        >
                                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                          <span>{item}</span>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    No items completed
                                  </p>
                                )}
                              </div>

                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                  <p className="text-sm font-medium text-gray-700">
                                    Score
                                  </p>
                                  <p className="text-base font-bold text-gray-900">
                                    {checklistTotal} / {checklistMax}
                                  </p>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-gray-600">
                                    Percentage
                                  </p>
                                  <p className="text-base font-semibold text-blue-600">
                                    {Math.round(Number(checklistPercent) || 0)}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          </GradeGivenSection>
                        );

                      case "passFail":
                        const passFail = grader.grade?.passfail;
                        const isPass = passFail?.pass ?? false;
                        return (
                          <GradeGivenSection
                            key={idx}
                            grade={grader}
                            gradingTemplate={gradingTemplate}
                          >
                            <div className="bg-[#FDFDFD] border border-gray-200 rounded-[24.5px] p-4 shadow-sm">
                              <div
                                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${
                                  isPass
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {isPass ? "✓ Passed" : "✗ Failed"}
                              </div>
                            </div>
                          </GradeGivenSection>
                        );

                      default:
                        return null;
                    }
                  })}
                </>
              )}

              {groupedGrades?.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-8 py-16 px-6 bg-[#FDFDFD] border border-dashed border-gray-300 rounded-[24.5px] space-y-4">
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
                    Once teachers grade the submissions, you&apos;ll see them
                    here. Be the first one to grade this test 🙂
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "gradeTest" && (
            <motion.div
              key="gradeTest"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FDFDFD] rounded-[27px] p-5 space-y-4"
            >
              {checkPostIsNotThisUser ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-[24.5px] p-4">
                  <p className="text-sm text-yellow-800">
                    You cannot grade your own post
                  </p>
                </div>
              ) : (
                <>
                  {/* Show grading section if NOT graded OR if editing existing grade */}
                  {(!checkPostIsGradedByThisUser || isEditingGrade) && (
                    <div className="mt-2 flex flex-col items-start w-full">
                      {gradingTemplate?.type === "rubric" && (
                        <GradeTemplateRubric
                          criteria={gradingTemplate.criteria}
                          totalRange={gradingTemplate.criteria.total}
                          gradingTemplate={gradingTemplate}
                          postId={postId}
                          defaultCriteria={
                            (existingGradeData as any).defaultCriteria as
                              | Record<string, number>
                              | undefined
                          }
                          defaultComment={
                            (existingGradeData as any).defaultComment as string
                          }
                          commentId={
                            (existingGradeData as any).commentId as
                              | string
                              | undefined
                          }
                          gradeId={
                            (existingGradeData as any).gradeId as
                              | string
                              | undefined
                          }
                        />
                      )}

                      {gradingTemplate?.type === "numeric" && (
                        <GradeTemplateNumeric
                          label="Score"
                          min={gradingTemplate.criteria.numericCriteria.min}
                          max={gradingTemplate.criteria.numericCriteria.max}
                          gradingTemplate={gradingTemplate}
                          postId={postId}
                          defaultValue={
                            (existingGradeData as any).defaultValue as number
                          }
                          defaultComment={
                            (existingGradeData as any).defaultComment as string
                          }
                          commentId={
                            (existingGradeData as any).commentId as
                              | string
                              | undefined
                          }
                          gradeId={
                            (existingGradeData as any).gradeId as
                              | string
                              | undefined
                          }
                        />
                      )}

                      {gradingTemplate?.type === "letter" && (
                        <GradeTemplateLetter
                          ranges={gradingTemplate.criteria.letterRanges}
                          gradingTemplate={gradingTemplate}
                          postId={postId}
                          defaultValue={
                            (existingGradeData as any).defaultValue as number
                          }
                          defaultComment={
                            (existingGradeData as any).defaultComment as string
                          }
                          commentId={
                            (existingGradeData as any).commentId as
                              | string
                              | undefined
                          }
                          gradeId={
                            (existingGradeData as any).gradeId as
                              | string
                              | undefined
                          }
                        />
                      )}

                      {gradingTemplate?.type === "weightedRubric" && (
                        <GradeTemplateWeightedRubric
                          criteria={gradingTemplate.criteria}
                          totalRange={gradingTemplate.criteria.total}
                          gradingTemplate={gradingTemplate}
                          postId={postId}
                          defaultCriteria={
                            (existingGradeData as any).defaultCriteria as
                              | Record<string, number>
                              | undefined
                          }
                          defaultComment={
                            (existingGradeData as any).defaultComment as string
                          }
                          commentId={
                            (existingGradeData as any).commentId as
                              | string
                              | undefined
                          }
                          gradeId={
                            (existingGradeData as any).gradeId as
                              | string
                              | undefined
                          }
                        />
                      )}

                      {gradingTemplate?.type === "checklist" && (
                        <GradeTemplateChecklist
                          items={gradingTemplate.criteria.checklistItems}
                          criteria={gradingTemplate.criteria}
                          gradingTemplate={gradingTemplate}
                          postId={postId}
                          defaultCheckedItems={
                            (existingGradeData as any)
                              .defaultCheckedItems as string[]
                          }
                          defaultComment={
                            (existingGradeData as any).defaultComment as string
                          }
                          commentId={
                            (existingGradeData as any).commentId as
                              | string
                              | undefined
                          }
                          gradeId={
                            (existingGradeData as any).gradeId as
                              | string
                              | undefined
                          }
                        />
                      )}

                      {gradingTemplate?.type === "passFail" && (
                        <GradeTemplatePassFail
                          criteria={gradingTemplate.criteria}
                          gradingTemplate={gradingTemplate}
                          postId={postId}
                          defaultPass={
                            (existingGradeData as any).defaultPass as
                              | boolean
                              | null
                          }
                          defaultComment={
                            (existingGradeData as any).defaultComment as string
                          }
                          commentId={
                            (existingGradeData as any).commentId as
                              | string
                              | undefined
                          }
                          gradeId={
                            (existingGradeData as any).gradeId as
                              | string
                              | undefined
                          }
                        />
                      )}
                    </div>
                  )}

                  {/* Show "Already graded" notice if graded and NOT editing */}
                  {checkPostIsGradedByThisUser && !isEditingGrade && (
                    <AlreadyGradedNotice
                      onEdit={handleEditGrade}
                      onDelete={handleDeleteGrade}
                    />
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Modal (Responsive) */}
      {modalComponent && (
        <ResponsiveModal
          isOpen={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) {
              setModalComponent(null);
              setModalProps({});
            }
          }}
          title=""
        >
          {React.createElement(modalComponent, modalProps)}
        </ResponsiveModal>
      )}

      {/* Delete Grade Modal */}
      {currentUserGrade?.id && currentUserCommentId && (
        <ResponsiveModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="Delete Grade"
        >
          <DeleteGradeModal
            postId={postId}
            gradeId={currentUserGrade.id}
            commentId={currentUserCommentId}
          />
        </ResponsiveModal>
      )}

      {/* PDF Full Screen Viewer - mobile */}
      <ResponsiveModal
        isOpen={isPdfFullScreenOpen}
        onOpenChange={setIsPdfFullScreenOpen}
        title="PDF Viewer"
        maxHeight="100vh"
        nested
        zIndex={200}
      >
        <div className="p-0 h-screen max-h-screen flex flex-col bg-[#F6F7FB]">
          <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-200 bg-white">
            <p className="text-sm font-medium text-gray-900 truncate pr-2">
              {currentFile ? currentFile.split("/").pop() : "PDF document"}
            </p>
            <button
              type="button"
              onClick={() => setIsPdfFullScreenOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded-full hover:bg-gray-100"
            >
              Close
            </button>
          </div>
          <div className="flex-1 min-h-0 bg-gray-100">
            {ext === "pdf" && currentFile && (
              <PdfAnnotationOverlay
                postId={postId}
                uploadId={currentUploadId}
                fileUrl={ensureHttps(currentFile)}
                canCreateAnnotations={canCreateImageAnnotations}
                variant="mobile"
              />
            )}
          </div>
        </div>
      </ResponsiveModal>

      {/* Image Viewer Modal */}
      <ImageViewer
        src={imageViewerSrc}
        isOpen={isImageViewerOpen}
        onClose={closeImageViewer}
      />
    </div>
  );
}
