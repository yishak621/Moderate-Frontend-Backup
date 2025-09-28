"use client";

import Button from "@/components/ui/Button";
import { GradeResult } from "@/types/grade";
import React, { useState } from "react";

type Item = { key: string; label: string; points?: number };

type Props = {
  items: Item[];
  onSave?: (res: GradeResult) => void;
};

export function GradeTemplateChecklist({ items, onSave }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    items.reduce((a, i) => ({ ...a, [i.key]: false }), {})
  );
  const toggle = (key: string) => setChecked((s) => ({ ...s, [key]: !s[key] }));

  const total = items.reduce(
    (sum, it) => sum + (checked[it.key] ? it.points ?? 1 : 0),
    0
  );
  const max = items.reduce((sum, it) => sum + (it.points ?? 1), 0);
  const percent = (total / max) * 100;

  return (
    <div className="p-4">
      <div className="mb-2 font-medium">Checklist</div>
      <div className="flex flex-col gap-2 mb-3">
        {items.map((it) => (
          <label key={it.key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!checked[it.key]}
              onChange={() => toggle(it.key)}
            />
            <span>
              {it.label} {it.points ? `(${it.points})` : ""}
            </span>
          </label>
        ))}
      </div>
      <div className="mb-2">
        Total: {total} / {max} ({Math.round(percent)}%)
      </div>
      <Button
        onClick={() => onSave?.({ totalScore: total, maxScore: max, percent })}
      >
        Save
      </Button>
    </div>
  );
}
