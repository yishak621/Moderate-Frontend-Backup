"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { GradeResult, LetterRange } from "@/types/grade";
import React, { useState } from "react";

type Props = {
  ranges: LetterRange[]; // e.g. [{letter:'A', min:85, max:100}, ...]
  max?: number;
  defaultValue?: number;
  onSave?: (res: GradeResult) => void;
};

export function GradeTemplateLetter({
  ranges,
  max = 100,
  defaultValue = 0,
  onSave,
}: Props) {
  const [value, setValue] = useState<number>(defaultValue);
  const [feedback, setFeedback] = useState("");

  const findLetter = (score: number) =>
    ranges.find((r) => score >= r.min && score <= r.max)?.letter ?? null;

  const compute = (): GradeResult => {
    const total = Math.max(0, Math.min(max, Number(value) || 0));
    const percent = (total / max) * 100;
    const letter = findLetter(total);
    return { totalScore: total, maxScore: max, percent, letter };
  };

  return (
    <div className="p-4">
      <div className="mb-2">Numeric Score (0 - {max})</div>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-2 border rounded my-2"
      />
      <div className="flex gap-2">
        <Button onClick={() => onSave?.(compute())}>Save</Button>
      </div>

      <div className="mt-3 text-sm">
        {compute().totalScore} / {max} — {compute().letter ?? "No letter"}
      </div>
    </div>
  );
}
