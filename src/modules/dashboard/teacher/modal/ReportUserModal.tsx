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
    <div className="bg-[#FDFDFD] min-w-[500px] max-w-[600px] p-8 rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={24} />
            <h2 className="text-xl font-semibold text-[#0c0c0c]">
              Report User
            </h2>
          </div>
          <p className="text-sm text-[#717171]">
            Reporting: <span className="font-medium">{reportedUser.name}</span>
          </p>
          <p className="text-xs text-[#717171] mt-1">
            Please provide a detailed reason for your report. False reports may
            result in action against your account.
          </p>
        </div>
        <button
          onClick={close}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={22} className="text-[#000000] cursor-pointer" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-[#0c0c0c] mb-2">
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
          <Textarea
            label="Reason for Report"
            placeholder="Please provide a detailed explanation (minimum 10 characters)..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            required
            rows={5}
            disabled={isPending}
          />
          <p className="text-xs text-gray-500 mt-1">
            {reason.length}/50 characters minimum
          </p>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>

        {/* Rate Limit Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> You can submit up to 5 reports per hour and
            20 reports per day. Duplicate reports for the same user will be
            ignored.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="red"
            disabled={isPending || reason.trim().length < 20}
          >
            {isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </form>
    </div>
  );
}
