"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { useReviewAppeal } from "@/hooks/useModeration";
import { Appeal, ReviewAppealInput } from "@/types/moderation";
import { useModal } from "@/components/ui/Modal";
import CustomSelect from "@/components/ui/CustomSelect";

interface ReviewAppealModalProps {
  appeal: Appeal;
}

const reviewOptions = [
  { value: "accepted", label: "Accept Appeal" },
  { value: "rejected", label: "Reject Appeal" },
];

export default function ReviewAppealModal({ appeal }: ReviewAppealModalProps) {
  const { close } = useModal();
  const { mutate: reviewAppeal, isPending } = useReviewAppeal();
  const [status, setStatus] = useState<"accepted" | "rejected">("accepted");
  const [adminNotes, setAdminNotes] = useState("");
  const [error, setError] = useState("");

  const handleReview = () => {
    setError("");
    const data: ReviewAppealInput = {
      status,
      adminNotes: adminNotes.trim() || undefined,
    };
    reviewAppeal(
      { appealId: appeal.id, data },
      {
        onSuccess: () => {
          close();
        },
        onError: (err: Error) => {
          setError(err.message || "Failed to review appeal");
        },
      }
    );
  };

  return (
    <div className="p-6 bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] sm:p-6 md:p-10 rounded-2xl md:rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-orange-500" size={24} />
          <h2 className="text-xl font-semibold text-[#0c0c0c]">
            Review Appeal
          </h2>
        </div>
        <p className="text-sm text-[#717171]">
          Review appeal from:{" "}
          <span className="font-medium">{appeal.user?.name || "Unknown"}</span>
        </p>
      </div>

      {/* Appeal Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle
            className="text-orange-600 flex-shrink-0 mt-0.5"
            size={16}
          />
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-800">
              Appeal Reason:
            </p>
            <p className="text-xs text-gray-600 whitespace-pre-wrap">
              {appeal.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0c0c0c] mb-2">
            Decision
          </label>
          <CustomSelect
            options={reviewOptions}
            defaultValue={reviewOptions.find((o) => o.value === status)}
            onChange={(option) =>
              setStatus(
                (option?.value as "accepted" | "rejected") || "accepted"
              )
            }
          />
        </div>

        <Textarea
          label="Admin Notes (Optional)"
          placeholder="Add any notes about this decision..."
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={4}
          disabled={isPending}
        />

        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={close}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant={status === "accepted" ? "green" : "red"}
          onClick={handleReview}
          disabled={isPending}
        >
          {isPending
            ? "Reviewing..."
            : status === "accepted"
            ? "Accept Appeal"
            : "Reject Appeal"}
        </Button>
      </div>
    </div>
  );
}
