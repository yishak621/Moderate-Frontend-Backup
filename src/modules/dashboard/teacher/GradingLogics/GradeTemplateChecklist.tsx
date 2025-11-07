"use client";

import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { GradeResult } from "@/types/grade";
import React, { useState, useMemo } from "react";
import { useUserSaveGrade } from "@/hooks/useUser";
import toast from "react-hot-toast";

type Item = { key: string; label: string; points?: number };

type Props = {
  items: string[] | Item[];
  criteria: any;
  gradingTemplate: any;
  postId: string;
};

export function GradeTemplateChecklist({
  items,
  criteria,
  gradingTemplate,
  postId,
}: Props) {
  const { saveGradeAsync, isSavingGradeLoading } = useUserSaveGrade();
  const [comment, setComment] = useState("");

  // Transform items - handle both string array and Item array
  const checklistItems: Item[] = useMemo(() => {
    if (!items || items.length === 0) return [];

    // If items is an array of strings, convert to Item format
    if (typeof items[0] === "string") {
      return (items as string[]).map((item, index) => ({
        key: `item-${index}`,
        label: item,
        points: 1, // Default 1 point per item
      }));
    }

    // If items is already in Item format
    return items as Item[];
  }, [items]);

  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    return checklistItems.reduce((acc, item) => {
      acc[item.key] = false;
      return acc;
    }, {} as Record<string, boolean>);
  });

  const toggle = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const total = checklistItems.reduce(
    (sum, it) => sum + (checked[it.key] ? it.points ?? 1 : 0),
    0
  );
  const max = checklistItems.reduce((sum, it) => sum + (it.points ?? 1), 0);
  const percent = max > 0 ? (total / max) * 100 : 0;

  // Get checked items as array of labels
  const checkedItems = checklistItems
    .filter((item) => checked[item.key])
    .map((item) => item.label);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (checklistItems.length === 0) {
      toast.error("No checklist items available");
      return;
    }

    try {
      await saveGradeAsync({
        postId,
        gradeData: {
          gradeType: gradingTemplate?.type || "checklist",
          grade: {
            checklist: {
              items: checkedItems,
              totalScore: total,
              maxScore: max,
              percentage: Math.round(percent),
            },
          },
          gradeTemplateId: gradingTemplate?.id,
          criteria: gradingTemplate?.criteria || criteria,
          comment: comment.trim() || undefined,
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save grade");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 w-full">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Checklist Grading
        </h3>
        <div className="flex flex-col gap-3 w-full">
          {checklistItems.map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={!!checked[item.key]}
                onChange={() => toggle(item.key)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="flex-1 text-sm font-medium text-gray-700">
                {item.label}
              </span>
              {item.points && item.points !== 1 && (
                <span className="text-xs text-gray-500">
                  ({item.points} pts)
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Score</span>
          <span className="text-lg font-bold text-gray-900">
            {total} / {max}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Percentage</span>
          <span className="text-base font-semibold text-blue-600">
            {Math.round(percent)}%
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comment (Optional)
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full"
        />
      </div>

      <Button
        type="submit"
        disabled={isSavingGradeLoading || checklistItems.length === 0}
        className="w-full"
      >
        {isSavingGradeLoading ? "Saving..." : "Save Grade"}
      </Button>
    </form>
  );
}
