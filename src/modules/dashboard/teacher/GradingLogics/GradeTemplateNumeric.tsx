"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useUserSaveGrade } from "@/hooks/useUser";
import { GradeResult } from "@/types/grade";
import { GradeParametersType } from "@/types/GradeParameters";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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

export function GradeTemplateNumeric({
  label = "Score",
  min = 0,
  max = 100,
  defaultValue = 0,
  onSave,
  onPublish,
  gradingTemplate,
  postId,
}: Props) {
  // const [value, setValue] = useState<number>(defaultValue);
  const [feedback, setFeedback] = useState("");

  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
    setValue: setValueRHF,
  } = useForm<Props>();
  const {
    saveGradeAsync,
    saveGrade,
    isSavingGradeError,
    isSavingGradeLoading,
    isSavingGradeSuccess,
  } = useUserSaveGrade();
  const value = watch("value") ?? 0;

  const result = (): GradeResult | null => {
    if (value !== undefined && value <= max) {
      const total = value / max;
      const percent = (value / max) * 100;
      return { totalScore: total, maxScore: max, percent, letter: null };
    }
    return null;
  };

  // const handleSave = () => onSave?.(result());
  // const handlePublish = () => onPublish?.(result());

  const onSubmit = async (data: Props) => {
    try {
      await saveGradeAsync({
        postId,
        gradeData: {
          gradeType: gradingTemplate?.type,
          grade: { numeric: data.value },
          gradeTemplateId: gradingTemplate?.id,
          criteria: gradingTemplate?.criteria,
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
      className="p-6 w-full rounded-2xl bg-card  "
    >
      <label className="block font-normal text-[#000000] text-base mb-3 text-foreground">
        Grading Logic Type{" "}
        <span className=" capitalize font-bold">{gradingTemplate?.type}</span>
      </label>

      {/* Score Section */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="md:w-2/3">
          <Input
            type="number"
            placeholder="Enter score"
            className="w-full text-lg font-medium"
            {...register("value", {
              required: "Value is required!",

              validate: (v) => {
                const num = Number(v);
                return (
                  (num >= min && num <= max) ||
                  `Value must be between ${min} and ${max}`
                );
              },
            })}
            error={errors?.value?.message}
          />
        </div>
        <div className="md:w-1/3 flex flex-col md:justify-center text-sm text-muted-foreground">
          <span>
            Min: <strong>{min}</strong>
          </span>
          <span>
            Max: <strong>{max}</strong>
          </span>
        </div>
      </div>

      {/* Feedback */}
      <Textarea
        placeholder="Write a short comment explaining this grade..."
        defaultValue={feedback}
        className="w-full mt-4 resize-none min-h-[100px]"
        maxLength={400}
        {...register("comment")}
      />

      {/* Actions & Total */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-5 pt-4">
        <div className="text-sm text-muted-foreground">
          Total: <strong className="text-foreground text-base">{value}</strong>{" "}
          / {result()?.maxScore}{" "}
          <span className="text-primary font-medium">
            ({Math.round(result()?.percent || 0)}%)
          </span>
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
