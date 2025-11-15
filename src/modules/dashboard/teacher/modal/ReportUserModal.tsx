"use client";

import { useState } from "react";
import { useModal } from "@/components/ui/Modal";
import { X, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import CustomSelect from "@/components/ui/CustomSelect";
import { useCreateReport } from "@/hooks/useModeration";
import { ReportCategory } from "@/types/moderation";
import { User } from "@/app/types/user";

interface ReportUserModalProps {
  reportedUser: User;
}

const reportCategories: { value: ReportCategory; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "inappropriate_content", label: "Inappropriate Content" },
  { value: "fake_account", label: "Fake Account" },
  { value: "copyright", label: "Copyright Violation" },
  { value: "other", label: "Other" },
];

export default function ReportUserModal({
  reportedUser,
}: ReportUserModalProps) {
  const { close } = useModal();
  const { createReportAsync, isPending } = useCreateReport();

  const [category, setCategory] = useState<ReportCategory>("spam");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("reported", reason.trim().length);
    if (reason.trim().length < 20) {
      setError("Reason must be at least 20 characters long");
      return;
    }

    try {
      await createReportAsync({
        reportedId: reportedUser.id!,
        reason: reason.trim(),
        category,
      });
      close();
    } catch (err: any) {
      setError(err.message || "Failed to submit report");
    }
  };

  if (!reportedUser) return null;

  return (
    <div className="bg-[#FDFDFD] w-full max-w-[600px] sm:min-w-[500px] p-5 sm:p-8 rounded-[20px] sm:rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="text-red-500" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold text-[#0c0c0c] truncate">
              Report User
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#717171] truncate">
            Reporting: <span className="font-medium">{reportedUser.name}</span>
          </p>
          <p className="text-[11px] sm:text-xs text-[#717171] mt-1">
            Please provide a detailed reason for your report. False reports may
            result in action against your account.
          </p>
        </div>
        <button
          onClick={close}
          className="p-1.5 hover:bg-gray-100 hidden sm:block rounded-full transition-colors shrink-0"
        >
          <X size={18} className="text-[#000000] cursor-pointer" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        {/* Category Selection */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#0c0c0c] mb-1.5 sm:mb-2">
            Report Category
          </label>
          <CustomSelect
            options={reportCategories}
            defaultValue={reportCategories.find((c) => c.value === category)}
            onChange={(option) =>
              setCategory((option?.value as ReportCategory) || "spam")
            }
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#0c0c0c] mb-1.5 sm:mb-2">
            Reason for Report
          </label>
          <Textarea
            placeholder="Please provide a detailed explanation (minimum 20 characters)..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            required
            rows={4}
            disabled={isPending}
            className="px-3 py-2 text-[13px] sm:text-base min-h-[96px]"
          />
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
            {reason.length}/20 characters minimum
          </p>
          {error && (
            <p className="text-[11px] sm:text-xs text-red-600 mt-1">{error}</p>
          )}
        </div>

        {/* Rate Limit Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3">
          <p className="text-[11px] sm:text-xs text-blue-800">
            <strong>Note:</strong> You can submit up to 5 reports per hour and
            20 reports per day. Duplicate reports for the same user will be
            ignored.
          </p>
        </div>

        {/* Actions */}
        <div className="sm:static sticky bottom-0 bg-[#FDFDFD] pt-2 sm:pt-0">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-3 sm:mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={isPending}
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="red"
              disabled={isPending || reason.trim().length < 20}
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
            >
              {isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
