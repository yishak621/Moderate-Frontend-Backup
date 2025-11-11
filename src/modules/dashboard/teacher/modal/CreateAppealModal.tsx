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
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Scale className="text-blue-500" size={24} />
          <h2 className="text-xl font-semibold text-[#0c0c0c]">
            Create Appeal
          </h2>
        </div>
        <p className="text-sm text-[#717171]">
          Submit an appeal to challenge your account moderation. Please provide
          a detailed explanation.
        </p>
      </div>

      {/* Status Info */}
      {moderation && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle
              className="text-orange-600 flex-shrink-0 mt-0.5"
              size={16}
            />
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-gray-800">
                Current Status:{" "}
                <span className="capitalize">
                  {moderation.status.replace("_", " ")}
                </span>
              </p>
              {moderation.violationCount > 0 && (
                <p className="text-xs text-gray-600">
                  Violations: {moderation.violationCount}
                </p>
              )}
              {moderation.suspensionEndDate && (
                <p className="text-xs text-gray-600">
                  Suspension ends:{" "}
                  {new Date(moderation.suspensionEndDate).toLocaleDateString()}
                </p>
              )}
              {moderation.banReason && (
                <p className="text-xs text-gray-600">
                  Ban reason: {moderation.banReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Textarea
            label="Appeal Reason (Required)"
            placeholder="Please provide a detailed explanation of why you believe the moderation action was incorrect (minimum 10 characters)..."
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
            {reason.length}/10 characters minimum
          </p>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose?.();
              close();
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isPending || reason.trim().length < 10}
          >
            {isPending ? "Submitting..." : "Submit Appeal"}
          </Button>
        </div>
      </form>
    </div>
  );
}
