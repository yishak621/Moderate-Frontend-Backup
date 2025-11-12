"use client";

import { X, AlertTriangle, User, Calendar, FileText } from "lucide-react";
import { Report } from "@/types/moderation";
import { timeAgo } from "@/lib/timeAgo";
import { useModal } from "@/components/ui/Modal";

interface ViewReportModalProps {
  report: Report;
}

export default function ViewReportModal({ report }: ViewReportModalProps) {
  const { close } = useModal();

  const categoryLabels: Record<string, string> = {
    spam: "Spam",
    harassment: "Harassment",
    inappropriate_content: "Inappropriate Content",
    fake_account: "Fake Account",
    copyright: "Copyright Violation",
    other: "Other",
  };

  return (
    <div className="bg-[#FDFDFD] w-full min-w-[600px] max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[27px] flex flex-col scrollbar-hide">
      {/* Header */}
      <div className="sticky top-0 bg-[#FDFDFD] z-10 border-b border-gray-200 px-8 py-6 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-500" size={24} />
          <h2 className="text-2xl font-semibold text-gray-900">
            Report Details
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
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                report.resolved
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {report.resolved ? "Resolved" : "Pending"}
            </span>
          </div>
          {report.resolved && report.resolvedAt && (
            <p className="text-sm text-gray-600">
              Resolved: {timeAgo(report.resolvedAt)}
            </p>
          )}

          <div>
            {report?.resolution && (
              <p className="text-sm text-gray-600">
                Resolution Notes: {report.resolution}
              </p>
            )}
          </div>
        </div>

        {/* Reporter */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Reporter
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                Name
              </p>
              <p className="text-sm text-gray-800">
                {report.reporter?.name || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                Email
              </p>
              <p className="text-sm text-gray-800">
                {report.reporter?.email || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Reported User */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Reported User
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                Name
              </p>
              <p className="text-sm text-gray-800">
                {report.reported?.name || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                Email
              </p>
              <p className="text-sm text-gray-800">
                {report.reported?.email || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Report Details */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Report Details
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                Category
              </p>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
                {categoryLabels[report.category] || report.category}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                Reason
              </p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {report.reason}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                Reported At
              </p>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-500" />
                <p className="text-sm text-gray-800">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
                <span className="text-xs text-gray-500">
                  ({timeAgo(report.createdAt)})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
