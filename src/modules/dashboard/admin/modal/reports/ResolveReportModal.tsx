"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { useResolveReport } from "@/hooks/useModeration";
import { Report } from "@/types/moderation";
import { useModal } from "@/components/ui/Modal";

interface ResolveReportModalProps {
  report: Report;
}

export default function ResolveReportModal({
  report,
}: ResolveReportModalProps) {
  const { close } = useModal();
  const { mutate: resolveReport, isPending } = useResolveReport();
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [error, setError] = useState("");

  const handleResolve = () => {
    setError("");
    resolveReport(
      {
        reportId: report.id,
        resolutionNotes: resolutionNotes.trim() || undefined,
      },
      {
        onSuccess: () => {
          close();
        },
        onError: (err: Error) => {
          setError(err.message || "Failed to resolve report");
        },
      }
    );
  };

  return (
    <div className=" flex flex-col bg-[#FDFDFD] min-w-[551px] p-10 rounded-[27px]">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-green-500" size={24} />
          <h2 className="text-xl font-semibold text-[#0c0c0c]">
            Resolve Report
          </h2>
        </div>
        <p className="text-sm text-[#717171]">
          Are you sure you want to mark this report as resolved?
        </p>
      </div>

      {/* Report Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle
            className="text-orange-600 flex-shrink-0 mt-0.5"
            size={16}
          />
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-800">
              Reported: {report.reported?.name || "Unknown User"}
            </p>
            <p className="text-xs text-gray-600">Category: {report.category}</p>
            <p className="text-xs text-gray-600 truncate max-w-md">
              {report.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Resolution Notes */}
      <div className="mb-4">
        <Textarea
          label="Resolution Notes (Optional)"
          placeholder="Add any notes about how this report was resolved..."
          value={resolutionNotes}
          onChange={(e) => setResolutionNotes(e.target.value)}
          rows={4}
          disabled={isPending}
        />
      </div>

      {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

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
          type="button"
          variant="green"
          onClick={handleResolve}
          disabled={isPending}
        >
          {isPending ? "Resolving..." : "Resolve Report"}
        </Button>
      </div>
    </div>
  );
}
