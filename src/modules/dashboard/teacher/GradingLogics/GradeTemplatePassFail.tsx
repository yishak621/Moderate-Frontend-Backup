"use client";

import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { GradeResult } from "@/types/grade";
import React, { useEffect, useState } from "react";
import { useUserSaveGrade } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { useGradeEditStore } from "@/store/gradeEditStore";
type Props = {
  criteria: any;
  gradingTemplate: any;
  postId: string;
  passLabel?: string;
  failLabel?: string;
  defaultPass?: boolean | null;
  defaultComment?: string;
  commentId?: string;
  gradeId?: string;
};

export function GradeTemplatePassFail({
  criteria,
  gradingTemplate,
  postId,
  passLabel = "Pass",
  failLabel = "Fail",
  defaultPass = null,
  defaultComment = "",
  commentId,
  gradeId,
}: Props) {
  const { saveGradeAsync, isSavingGradeLoading, isSavingGradeSuccess } =
    useUserSaveGrade();
  const { setEditingGrade } = useGradeEditStore();
  const [pass, setPass] = useState<boolean | null>(defaultPass);
  const [comment, setComment] = useState(defaultComment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pass === null) {
      toast.error("Please select Pass or Fail");
      return;
    }

    try {
      await saveGradeAsync({
        postId,
        gradeData: {
          gradeType: gradingTemplate?.type.toLowerCase() || "passfail",
          grade: {
            passfail: {
              pass: pass,
            },
          },
          gradeTemplateId: gradingTemplate?.id,
          criteria: gradingTemplate?.criteria || criteria,
          comment: comment.trim() || undefined,
          commentId: commentId,
          gradeId: gradeId,
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save grade");
    }
  };

  useEffect(() => {
    if (isSavingGradeSuccess) {
      setEditingGrade(postId, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSavingGradeSuccess, postId]); // setEditingGrade is stable from Zustand

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium text-[#0C0C0C] mb-4">
          Pass/Fail Grading
        </h3>
        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={() => setPass(true)}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200 ${
              pass === true
                ? "bg-[#4CAF50] text-white hover:bg-[#3e9e43]"
                : "bg-[#FDFDFD] text-[#4CAF50] hover:bg-green-50 border border-[#DBDBDB]"
            }`}
          >
            {passLabel}
          </button>
          <button
            type="button"
            onClick={() => setPass(false)}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200 ${
              pass === false
                ? "bg-[#F25555] text-white hover:bg-[#D94444]"
                : "bg-[#FDFDFD] text-[#F25555] hover:bg-red-50 border border-[#DBDBDB]"
            }`}
          >
            {failLabel}
          </button>
        </div>

        {pass !== null && (
          <div className="p-4 bg-[#FDFDFD] border border-[#DBDBDB] rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <span
                className={`text-base font-semibold ${
                  pass ? "text-[#4CAF50]" : "text-[#F25555]"
                }`}
              >
                {pass ? "Passed" : "Failed"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comment (Optional)
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full"
        />
      </div>

      <Button
        type="submit"
        disabled={isSavingGradeLoading || pass === null}
        className="w-full"
      >
        {isSavingGradeLoading ? "Saving..." : "Save Grade"}
      </Button>
    </form>
  );
}
