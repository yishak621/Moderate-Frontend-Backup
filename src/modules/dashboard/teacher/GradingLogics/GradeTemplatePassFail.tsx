"use client";

import Button from "@/components/ui/Button";
import { GradeResult } from "@/types/grade";
import React, { useState } from "react";

type Props = {
  passLabel?: string;
  failLabel?: string;
  onSave?: (res: GradeResult & { pass: boolean }) => void;
};

export function GradeTemplatePassFail({
  passLabel = "Pass",
  failLabel = "Fail",
  onSave,
}: Props) {
  const [pass, setPass] = useState<boolean | null>(null);
  const [note, setNote] = useState("");

  const compute = (): GradeResult & { pass: boolean | null } => ({
    totalScore: pass ? 1 : 0,
    maxScore: 1,
    percent: pass ? 100 : 0,
    letter: pass ? "P" : "F",
    extra: { note },
    pass,
  });

  return (
    <div className="p-4">
      <div className="flex gap-3 mb-2">
        <button
          onClick={() => setPass(true)}
          className={`px-3 py-1 rounded ${
            pass === true ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          {passLabel}
        </button>
        <button
          onClick={() => setPass(false)}
          className={`px-3 py-1 rounded ${
            pass === false ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          {failLabel}
        </button>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Notes..."
        className="w-full p-2 border rounded mb-2"
      />
      {/* onClick={() => pass !== null && onSave?.(compute())} */}
      <Button>Save</Button>
    </div>
  );
}
