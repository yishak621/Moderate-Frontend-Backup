"use client";

import { X, FileText, User, Calendar, AlertTriangle } from "lucide-react";
import { Appeal } from "@/types/moderation";
import { timeAgo } from "@/lib/timeAgo";
import { useModal } from "@/components/ui/Modal";

interface ViewAppealModalProps {
  appeal: Appeal;
}

export default function ViewAppealModal({ appeal }: ViewAppealModalProps) {
  const { close } = useModal();

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    accepted: { label: "Accepted", className: "bg-green-100 text-green-700" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  };
  const config = statusConfig[appeal.status] || statusConfig.pending;

  return (
    <div className="bg-[#FDFDFD] w-full min-w-[600px] max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[27px] flex flex-col scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-[#FDFDFD] z-10 border-b border-gray-200 px-8 py-6 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-orange-500" size={24} />
          <h2 className="text-2xl font-semibold text-gray-900">
            Appeal Details
          </h2>
        </div>
        <button
          onClick={close}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={22} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Status */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Status
            </h3>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${config.className}`}
            >
              {config.label}
            </span>
          </div>
          {appeal.reviewedAt && (
            <p className="text-sm text-gray-600">
              Reviewed: {timeAgo(appeal.reviewedAt)}
            </p>
          )}
          {appeal?.reviewNotes && (
            <p className="text-sm text-gray-600">
              Admin Notes: {appeal.reviewNotes}
            </p>
          )}
        </div>

        {/* User */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              User
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                Name
              </p>
              <p className="text-sm text-gray-800">
                {appeal.user?.name || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                Email
              </p>
              <p className="text-sm text-gray-800">
                {appeal.user?.email || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Appeal Details */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Appeal Details
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                Reason
              </p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {appeal.reason}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                Appealed At
              </p>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-500" />
                <p className="text-sm text-gray-800">
                  {new Date(appeal.createdAt).toLocaleString()}
                </p>
                <span className="text-xs text-gray-500">
                  ({timeAgo(appeal.createdAt)})
                </span>
              </div>
            </div>
            {appeal.adminNotes && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Admin Notes
                </p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {appeal.adminNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
