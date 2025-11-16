"use client";

import { useState } from "react";
import { Scale, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { useCreateAppeal } from "@/hooks/useModeration";
import { UserModeration } from "@/types/moderation";
import { useModal } from "@/components/ui/Modal";

interface CreateAppealModalProps {
  moderation?: UserModeration;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateAppealModal({
  moderation,
  onSuccess,
  onClose,
}: CreateAppealModalProps) {
  const { close } = useModal();
  const { mutate: createAppeal, isPending } = useCreateAppeal();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters long");
      return;
    }

    createAppeal(
      {
        moderationId: moderation?.id, // Optional - send if available
        reason: reason.trim(),
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose?.();
          close();
        },
        onError: (err: Error) => {
          setError(err.message || "Failed to submit appeal");
        },
      }
    );
  };

  return (
    <div className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-1.5 sm:gap-2 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <Scale className="text-blue-500" size={20} />
          <h2 className="text-lg sm:text-xl font-semibold text-[#0c0c0c]">
            Create Appeal
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#717171]">
          Submit an appeal to challenge your account moderation. Please provide
          a detailed explanation.
        </p>
      </div>

      {/* Status Info */}
      {moderation && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle
              className="text-orange-600 flex-shrink-0 mt-0.5"
              size={14}
            />
            <div className="flex flex-col gap-1">
              <p className="text-[11px] sm:text-xs font-semibold text-gray-800">
                Current Status:{" "}
                <span className="capitalize">
                  {moderation.status.replace("_", " ")}
                </span>
              </p>
              {moderation.violationCount > 0 && (
                <p className="text-[11px] sm:text-xs text-gray-600">
                  Violations: {moderation.violationCount}
                </p>
              )}
              {moderation.suspensionEndDate && (
                <p className="text-[11px] sm:text-xs text-gray-600">
                  Suspension ends:{" "}
                  {new Date(moderation.suspensionEndDate).toLocaleDateString()}
                </p>
              )}
              {moderation.banReason && (
                <p className="text-[11px] sm:text-xs text-gray-600">
                  Ban reason: {moderation.banReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#0c0c0c] mb-1.5 sm:mb-2">
            Appeal Reason (Required)
          </label>
          <Textarea
            placeholder="Please provide a detailed explanation of why you believe the moderation action was incorrect (minimum 10 characters)..."
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
            {reason.length}/10 characters minimum
          </p>
          {error && <p className="text-[11px] sm:text-xs text-red-600 mt-1">{error}</p>}
        </div>

        {/* Actions */}
        <div className="sm:static sticky bottom-0 bg-[#FDFDFD] pt-2 sm:pt-0">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-3 sm:mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose?.();
                close();
              }}
              disabled={isPending}
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending || reason.trim().length < 10}
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
            >
              {isPending ? "Submitting..." : "Submit Appeal"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
