"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { GradeResult } from "@/types/grade";
import { GradeParametersType } from "@/types/GradeParameters";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  label?: string;
  min?: number;
  max?: number;
  value?: number;
  comment?: string;
  defaultValue?: number;
  onSave?: (result: GradeResult) => void;
  onPublish?: (result: GradeResult) => void;
};

export function GradeTemplateNumeric({
  label = "Score",
  min = 0,
  max = 100,
  defaultValue = 0,
  onSave,
  onPublish,
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
  } = useForm<Props>({
    mode: "onBlur",
  });

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
    console.log(data);
    // try {
    //   console.log(data);
    //   await editAnnouncementAsync(data);
    //   toast.success("Announcement updated successfully!");
    //   close();
    // } catch (err) {
    //   if (err instanceof Error) {
    //     console.error(err.message);
    //     toast.error(err.message);
    //   } else {
    //     console.error("Unknown error", err);
    //     toast.error("Something went wrong");
    //   }
    // }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 w-full rounded-2xl bg-card  "
    >
      <label className="block font-normal text-[#0c0c0c] text-base mb-3 text-foreground">
        {label}
      </label>

      {/* Score Section */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="md:w-2/3">
          <Input
            type="number"
            min={min}
            max={max}
            defaultValue={value}
            // onChange={(e) => setValue(Number(e.target.value))}
            className="w-full text-lg font-medium"
            placeholder="Enter score"
            {...register("value", {
              required: "Title is required!",
              validate: (v) =>
                (v !== undefined && v <= max) ||
                `Value can not exceed maximum score ${max}`,
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
        value={feedback}
        // onChange={(e) => setFeedback(e.target.value)}
        className="w-full mt-4 resize-none min-h-[100px]"
        maxLength={40}
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
          <Button
            variant="outline"
            // onClick={handleSave}
            className="w-full md:w-auto"
          >
            Save Grade
          </Button>
          <Button type="submit" variant="primary" className="w-full md:w-auto">
            Publish
          </Button>
        </div>
      </div>
    </form>
  );
}
