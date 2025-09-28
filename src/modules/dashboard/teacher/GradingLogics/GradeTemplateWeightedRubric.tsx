"use client";

import { GradeResult, WeightedCriterion } from "@/types/grade";
import React, { useState } from "react";
import { RubricCriteriaItem } from "./GradeTemplateRubric";
import Button from "@/components/ui/Button";

type Props = {
  criteria: WeightedCriterion[]; // weight usually sum to 1 (or 100)
  onSave?: (r: GradeResult & { breakdown: Record<string, number> }) => void;
};

export function GradeTemplateWeightedRubric({ criteria, onSave }: Props) {
  // initial scores 0
  const initial = criteria.reduce(
    (acc, c) => ({ ...acc, [c.key]: 0 }),
    {} as Record<string, number>
  );
  const [scores, setScores] = useState<Record<string, number>>(initial);
  const [note, setNote] = useState("");

  const handleChange = (key: string, val: number) =>
    setScores((s) => ({ ...s, [key]: val }));

  const maxPossible = criteria.reduce(
    (sum, c) => sum + c.maxPoints * (c.weight ?? 1),
    0
  );

  const totalScore = criteria.reduce((sum, c) => {
    const raw = scores[c.key] ?? 0;
    const pct = raw / c.maxPoints || 0;
    return sum + pct * (c.weight ?? 1) * c.maxPoints;
  }, 0);

  const percent = (totalScore / maxPossible) * 100;

  return (
    <div className="p-4">
      <div className="mb-3 font-medium">Weighted Rubric</div>
      {criteria.map((c) => (
        <div key={c.key} className="mb-3">
          <div className="flex justify-between">
            <div>
              {c.label} (w:{c.weight})
            </div>
            <div>
              {scores[c.key] ?? 0}/{c.maxPoints}
            </div>
          </div>
          <RubricCriteriaItem
            name={c.label}
            value={scores[c.key] ?? 0}
            min={0}
            max={c.maxPoints}
            onChange={(v) => handleChange(c.key, v)}
          />
        </div>
      ))}

      <textarea
        placeholder="Notes..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-2 border rounded my-2"
      />

      <div className="mb-2">
        Total: <strong>{Math.round(totalScore)}</strong> /{" "}
        {Math.round(maxPossible)} ({Math.round(percent)}%)
      </div>

      <div className="flex gap-2">
        <Button
        //   onClick={() =>
        //     // onSave?.({
        //     //   totalScore,
        //     //   maxScore: maxPossible,
        //     //   percent,
        //     //   extra: { breakdown: scores, note },
        //     // })
        //   }
        >
          Save
        </Button>
      </div>
    </div>
  );
}
