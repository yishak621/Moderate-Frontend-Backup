"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useUserSaveGrade } from "@/hooks/useUser";
import { GradeResult, LetterRange } from "@/types/grade";
import { Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useGradeEditStore } from "@/store/gradeEditStore";

type Props = {
  label?: string;
  min?: number;
  max?: number;
  value?: number;
  comment?: string;
  defaultValue?: number;
  defaultComment?: string;
  commentId?: string;
  gradeId?: string;
  onSave?: (result: GradeResult) => void;
  onPublish?: (result: GradeResult) => void;
  gradingTemplate: any;
  postId: string;
  ranges: any;
};

type GradeRange = { min: number; max: number; letter: string };

export function GradeTemplateLetter({
  gradingTemplate,
  postId,
  ranges,
  max = 100,
  defaultValue = 0,
  defaultComment = "",
  commentId,
  gradeId,
  onSave,
}: Props) {
  console.log(ranges);
  const { setEditingGrade } = useGradeEditStore();
  const [feedback, setFeedback] = useState(defaultComment);

  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
    setValue: setValueRHF,
  } = useForm<Props>({
    defaultValues: {
      value: defaultValue,
      comment: defaultComment,
    },
  });
  const {
    saveGradeAsync,
    saveGrade,
    isSavingGradeError,
    isSavingGradeLoading,
    isSavingGradeSuccess,
  } = useUserSaveGrade();
  const value = watch("value") ?? 0;

  const findLetter = (score: number, ranges: GradeRange[]) => {
    return (
      ranges.find((r) => {
        const lower = Math.min(r.min, r.max);
        const upper = Math.max(r.min, r.max);
        return score >= lower && score <= upper;
      })?.letter ?? "N/A"
    );
  };

  const compute = (value: number, ranges: GradeRange[]) => {
    // Auto-select highest 'max' from ranges
    const max = Math.max(...ranges.map((r) => Math.max(r.min, r.max)));
    const total = Math.max(0, Math.min(max, Number(value) || 0));
    const percent = (total / max) * 100;
    const letter = findLetter(total, ranges);
    return { totalScore: total, maxScore: max, percent, letter };
  };

  const result = compute(value, ranges);

  const onSubmit = async (data: Props) => {
    try {
      // Compute result using the submitted data.value, not the watched value
      const submittedValue = Number(data.value) || 0;
      const computedResult = compute(submittedValue, ranges);

      console.log(computedResult);
      await saveGradeAsync({
        postId,
        gradeData: {
          gradeType: gradingTemplate?.type,
          grade: {
            letter: {
              letterGrade: {
                letter: computedResult.letter, // 1. Letter grade (A, B, C, etc.)
                totalScore: computedResult.totalScore, // 2. Score (number value)
                maxScore: computedResult.maxScore, // 3. Max score (for score/maxScore display)
                percent: computedResult.percent, // 4. Percent of user score over total score
              },
              score: computedResult.totalScore, // The actual score value
            },
          },
          gradeTemplateId: gradingTemplate?.id,
          criteria: gradingTemplate?.criteria,
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
      className="p-6 w-full rounded-2xl bg-card  "
    >
      <label className="block font-normal text-[#000000] text-base mb-3 text-foreground">
        Grading Logic Type{" "}
        <span className=" capitalize font-bold">{gradingTemplate?.type}</span>
      </label>
      <div className="w-full mt-6 mb-4">
        <div className="bg-gradient-to-b from-gray-50 to-white  border border-gray-200 rounded-2xl p-6 ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800  flex items-center gap-2">
              Grading Criteria
            </h2>
          </div>

          {ranges?.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-sm text-gray-600  border-b border-gray-200 ">
                  <th className="py-2">Score Range</th>
                  <th className="py-2">Letter Grade</th>
                  <th className="py-2">Performance</th>
                </tr>
              </thead>
              <tbody>
                {ranges?.map((item: any, index: number) => {
                  const colors = [
                    "bg-green-100 text-green-700 ",
                    "bg-yellow-100 text-yellow-700 ",
                    "bg-red-100 text-red-700 ",
                  ];
                  const colorClass =
                    colors[index] || "bg-gray-100 text-gray-700 ";

                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-100  hover:bg-gray-50  transition-all"
                    >
                      <td className="py-3 text-sm font-medium">
                        {item.min} - {item.max}
                      </td>
                      <td className="py-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full font-semibold ${colorClass}`}
                        >
                          {item.letter}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-500  italic">
                        {item.letter === "A"
                          ? "Excellent"
                          : item.letter === "B"
                          ? "Good Job "
                          : item.letter === "C"
                          ? "Needs Improvement "
                          : "Keep Going "}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500  text-sm py-6">
              No grading criteria provided.
            </div>
          )}
        </div>
      </div>
      {/* Score Section */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="md:w-2/3">
          <Input
            type="number"
            min="0"
            placeholder="Enter score"
            className="w-full text-lg font-medium"
            {...register("value", {
              required: "Value is required!",

              // validate: (v) => {
              //   const num = Number(v);
              //   return (
              //     (num >= min && num <= max) ||
              //     `Value must be between ${min} and ${max}`
              //   );
              // },
            })}
            error={errors?.value?.message}
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
                setValueRHF("value", 0);
              }
            }}
          />
        </div>
        <div className="md:w-1/3 flex flex-col md:justify-center text-sm text-muted-foreground">
          <span>{/* Min: <strong>{min}</strong> */}</span>
          <span>
            Letter Grade: <strong>{result.letter}</strong>
          </span>
        </div>
      </div>

      {/* Feedback */}
      <Textarea
        placeholder="Write a short comment explaining this grade..."
        defaultValue={defaultComment}
        className="w-full mt-4 resize-none min-h-[100px]"
        maxLength={400}
        {...register("comment")}
      />

      {/* Actions & Total */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-5 pt-4">
        <div className="text-sm text-muted-foreground">
          {/* Total: <strong className="text-foreground text-base">{value}</strong>{" "}
          / {result()?.maxScore}{" "}
          <span className="text-primary font-medium">
            ({Math.round(result()?.percent || 0)}%)
          </span> */}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {/* <Button
            variant="outline"
            // onClick={handleSave}
            className="w-full md:w-auto"
          >
            Save Grade
          </Button> */}
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
        </div>
      </div>
    </form>
  );
}
