"use client";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUserSaveGrade } from "@/hooks/useUser";
import {
  GradeResult,
  GradeTemplateRubricProps,
  WeightedCriterion,
} from "@/types/grade";

type WeightedRubricFormValues = {
  criteria: Record<string, number>;
  comment: string;
};

export default function GradeTemplateWeightedRubric({
  criteria,
  postId,
  gradingTemplate,
}: GradeTemplateRubricProps & {
  criteria: { rubricCriteria: WeightedCriterion[] };
}) {
  const { saveGradeAsync, isSavingGradeLoading } = useUserSaveGrade();
  console.log(criteria);
  const defaultValues = {
    criteria: criteria?.rubricCriteria.reduce((acc: any, c: any) => {
      acc[c.label] = 0;
      return acc;
    }, {} as Record<string, number>),
    comment: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<WeightedRubricFormValues>({ defaultValues });

  const watchedCriteria = watch("criteria");

  // Weighted total calculation

  // Sum weighted scores
  const totalScore =
    criteria?.rubricCriteria.reduce((sum: number, c: any) => {
      const score = Number(watchedCriteria[c.label]) || 0;
      const pct = score / c.maxPoints; // fraction of this criterion
      return sum + pct * c.weight; // weight as percentage
    }, 0) || 0;

  // Max score is sum of all weights
  const maxScore =
    criteria?.rubricCriteria.reduce(
      (sum: number, c: any) => sum + c.weight,
      0
    ) || 0;

  // Percentage
  const percentage = (totalScore / maxScore) * 100;

  const onSubmit = async (data: WeightedRubricFormValues) => {
    const rubricData = Object.entries(data.criteria).map(([key, value]) => {
      const criterion = criteria?.rubricCriteria.find(
        (c: any) => c.label === key
      );
      return {
        label: criterion?.label || key,
        value,
        weight: criterion?.weight,
      };
    });

    try {
      await saveGradeAsync({
        postId,
        gradeData: {
          gradeType: gradingTemplate.type,
          grade: {
            weightedRubric: {
              rubricData,
              totalScore,
              percentage,
            },
          },
          gradeTemplateId: gradingTemplate.id,
          criteria: gradingTemplate.criteria,
          comment: data.comment,
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800">
        Weighted Rubric Editor
      </h3>

      {criteria?.rubricCriteria.map((c: any) => (
        <div key={c.label} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            {c.label} ({c.minPoints ?? 0}-{c.maxPoints} pts){" "}
            <span className="text-xs text-gray-500">
              • Weight: {c.weight.toFixed(0)}%
            </span>
          </label>

          <Input
            type="number"
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
          <span className="font-medium text-gray-700">Weighted Total</span>
          <span className="font-bold text-blue-600">
            {Math.round(totalScore)} / {Math.round(maxScore)} (
            {Math.round(percentage)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(percentage, 100)}%` }}
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
          "Publish Weighted Grade"
        )}
      </Button>
    </form>
  );
}
