"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { GradeResult } from "@/types/grade";
import React, { useState } from "react";

type Props = {
  label?: string;
  min?: number;
  max?: number;
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
  const [value, setValue] = useState<number>(defaultValue);
  const [feedback, setFeedback] = useState("");

  const result = (): GradeResult => {
    const total = Math.max(min, Math.min(max, Number(value) || 0));
    const percent = (total / max) * 100;
    return { totalScore: total, maxScore: max, percent, letter: null };
  };

  const handleSave = () => onSave?.(result());
  const handlePublish = () => onPublish?.(result());

  return (
    <div className="p-4">
      <label className="block font-medium mb-2">
        {label} ({min}-{max})
      </label>
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mb-2"
      />
      <textarea
        placeholder="Feedback..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />
      <div className="flex gap-2">
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handlePublish}>Publish</Button>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        Total: <strong>{result().totalScore}</strong> / {result().maxScore} (
        {Math.round(result().percent)}%)
      </div>
    </div>
  );
}
