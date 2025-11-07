"use client";
import React from "react";
import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * Usage:
 * {activeFilter === "Grade Test" && checkPostIsGradedByThisUser && (
 *   <AlreadyGradedNotice
 *     onEdit={() => openEditModal()}
 *     onDelete={() => handleDeleteGrade()}
 *   />
 * )}
 */

type AlreadyGradedNoticeProps = {
  onEdit: () => void;
  onDelete?: () => void;
};

export default function AlreadyGradedNotice({
  onEdit,
  onDelete,
}: AlreadyGradedNoticeProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="w-full mt-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FDFDFD] border border-[#DBDBDB] flex items-start gap-4 sm:gap-6"
    >
      {/* Icon */}
      <div className="flex-none">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#368FFF]/10 border border-[#368FFF]/20 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#368FFF]" />
        </div>
      </div>

      {/* Text & actions */}
      <div className="min-w-0 flex-1">
        <h3 className="text-base sm:text-lg font-medium text-[#0C0C0C] mb-1">
          You already graded this
        </h3>

        <p className="text-sm sm:text-base text-[#717171] leading-relaxed mb-4">
          Our records show you&apos;ve already submitted a grade for this post.
          You can review, update, or delete your grade if needed.
        </p>

        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <Button
            type="button"
            onClick={onEdit}
            variant="primary"
            className="h-10 px-4 text-sm"
            icon={<Pencil size={16} />}
          >
            Edit Grade
          </Button>
          {onDelete && (
            <Button
              type="button"
              onClick={onDelete}
              variant="red"
              className="h-10 px-4 text-sm"
              icon={<Trash2 size={16} />}
            >
              Delete Grade
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
