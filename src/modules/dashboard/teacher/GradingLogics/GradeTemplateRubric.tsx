"use client";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import {
  GradeResult,
  GradeTemplateRubricProps,
  RubricCriteria,
  RubricCriteriaItemProps,
} from "@/types/grade";
import { useForm } from "react-hook-form";
import { useUserSaveGrade } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { useGradeEditStore } from "@/store/gradeEditStore";

type Props = {
  label?: string;
  min?: number;
  max?: number;
  value?: number;
  comment?: string;
  defaultValue?: number;
  onSave?: (result: GradeResult) => void;
  onPublish?: (result: GradeResult) => void;
  gradingTemplate: any;
  postId: string;
};

type RubricFormValues = {
  criteria: Record<string, number>;
  comment: string;
};

export default function GradeTemplateRubric({
  criteria,
  postId,
  gradingTemplate,
  defaultCriteria,
  defaultComment = "",
  commentId,
  gradeId,
}: GradeTemplateRubricProps & {
  defaultCriteria?: Record<string, number>;
  defaultComment?: string;
  commentId?: string;
  gradeId?: string;
}) {
  const { saveGradeAsync, isSavingGradeLoading, isSavingGradeSuccess } =
    useUserSaveGrade();
  const { setEditingGrade } = useGradeEditStore();

  const defaultValues = {
    criteria:
      defaultCriteria ||
      criteria?.rubricCriteria.reduce((acc: any, c: any) => {
        acc[c.label] = 0;
        return acc;
      }, {} as Record<string, number>),
    comment: defaultComment,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RubricFormValues>({ defaultValues });

  const watchedCriteria = watch("criteria");
  console.log(watchedCriteria, "watched");

  const totalScore = Object.values(watchedCriteria).reduce(
    (sum, val) => sum + Number(val),
    0
  );

  const maxScore = criteria?.rubricCriteria.reduce(
    (sum: number, c: any) => sum + c.maxPoints,
    0
  );
  const percentage = (totalScore / maxScore) * 100;
  const onSubmit = async (data: RubricFormValues) => {
    const rubricData = Object.entries(data.criteria).map(([key, value]) => {
      const criterion = criteria?.rubricCriteria.find(
        (c: any) => c.label === key
      );
      return { label: criterion?.label || key, value };
    });

    try {
      await saveGradeAsync({
        postId,
        gradeData: {
          gradeType: gradingTemplate.type,
          grade: { rubric: { rubricData, totalScore, percentage } },
          gradeTemplateId: gradingTemplate.id,
          criteria: gradingTemplate.criteria,
          comment: data.comment,
          commentId: commentId,
          gradeId: gradeId,
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  useEffect(() => {
    if (isSavingGradeSuccess) {
      setEditingGrade(postId, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSavingGradeSuccess, postId]); // setEditingGrade is stable from Zustand
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800">Rubric Editor</h3>

      {criteria?.rubricCriteria.map((c: any) => (
        <div key={c.label} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            {c.label} ({c.minPoints ?? 0}-{c.maxPoints} pts)
          </label>
          <Input
            type="number"
            min="0"
            className="w-24"
            placeholder="0"
            defaultValue=""
            {...register(`criteria.${c.label}`, {
              required: "Score required",
              min: {
                value: c.minPoints ?? 0,
                message: `Min ${c.minPoints ?? 0}`,
              },
              max: { value: c.maxPoints, message: `Max ${c.maxPoints}` },
            })}
            onKeyDown={(e) => {
              // Prevent negative sign, 'e', 'E' (scientific notation)
              if (e.key === "-" || e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              // Clamp to 0 if negative value is entered (handles paste)
              const val = Number(e.target.value);
              if (val < 0) {
                setValue(`criteria.${c.label}`, 0);
              }
            }}
          />

          {errors.criteria?.[c.label] && (
            <p className="text-red-500 text-xs">
              {errors.criteria[c.label]?.message}
            </p>
          )}
        </div>
      ))}

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Total Score</span>
          <span className="font-bold text-blue-600">
            {totalScore} / {maxScore} (
            {Math.round((totalScore / maxScore) * 100)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(totalScore / maxScore) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Feedback</label>
        <Textarea placeholder="Enter comments..." {...register("comment")} />
      </div>

      <Button
        type="submit"
        variant="primary"
        className={`justify-center text-base cursor-pointer w-full transition 
        ${isSavingGradeLoading && "opacity-70 cursor-not-allowed"}`}
        disabled={isSavingGradeLoading}
      >
        {isSavingGradeLoading ? (
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
            Publishing...
          </>
        ) : (
          "Publish Grade"
        )}
      </Button>
    </form>
  );
}
