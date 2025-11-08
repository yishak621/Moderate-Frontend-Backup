"use client";
import { useResponsiveModal } from "@/hooks/useResponsiveModal";
import { X, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useUserDeleteGrade } from "@/hooks/useUser";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface DeleteGradeModalProps {
  postId: string;
  gradeId: string;
  commentId: string;
}

export default function DeleteGradeModal({
  postId,
  gradeId,
  commentId,
}: DeleteGradeModalProps) {
  const { close } = useResponsiveModal();
  const {
    deleteGradeAsync,
    isDeletingGradeLoading,
    isDeletingGradeSuccess,
    isDeletingGradeError,
    deletingGradeError,
  } = useUserDeleteGrade();

  useEffect(() => {
    if (isDeletingGradeSuccess) {
      close();
    }
  }, [isDeletingGradeSuccess, close]);

  useEffect(() => {
    if (isDeletingGradeError && deletingGradeError) {
      const errorMessage =
        deletingGradeError instanceof Error
          ? deletingGradeError.message
          : "Failed to delete grade";
      toast.error(errorMessage);
    }
  }, [isDeletingGradeError, deletingGradeError]);

  const handleDelete = async () => {
    if (!commentId) {
      toast.error("Missing comment reference for this grade.");
      return;
    }

    try {
      await deleteGradeAsync({ postId, gradeId, commentId });
    } catch (err) {
      // Error handled in useEffect
    }
  };

  return (
    <div className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex flex-row justify-between items-start mb-4 md:mb-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 md:gap-3">
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            <p className="text-lg md:text-xl text-[#0c0c0c] font-medium">
              Delete Grade
            </p>
          </div>
          <p className="text-sm md:text-base font-normal text-[#717171] max-w-[400px]">
            Are you sure you want to delete this grade? This action cannot be
            undone.
          </p>
        </div>

        <div className="hidden sm:block" onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="text-[13px] md:text-sm font-medium text-red-800">
              Warning: Permanent Action
            </p>
            <p className="text-[12px] md:text-xs text-red-700">
              This grade will be permanently deleted. You can always grade again
              if needed.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 items-center w-full mt-4">
        <div className="w-1/3">
          <Button className="w-full" variant="secondary" onClick={close}>
            Cancel
          </Button>
        </div>
        <div className="w-2/3">
          <Button
            variant="red"
            className={`justify-center text-base cursor-pointer w-full transition 
        ${isDeletingGradeLoading && "opacity-70 cursor-not-allowed"}`}
            disabled={isDeletingGradeLoading}
            onClick={handleDelete}
          >
            {isDeletingGradeLoading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              "Delete Grade"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
