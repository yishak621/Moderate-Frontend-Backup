"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, CheckCircle2 } from "lucide-react";
import type { ComponentType } from "react";
import { Report } from "@/types/moderation";
import { truncateText } from "@/lib/truncateText";
import { timeAgo } from "@/lib/timeAgo";
import Tooltip from "@/components/ui/Tooltip";
import ViewReportModal from "@/modules/dashboard/admin/modal/reports/ViewReportModal";
import ResolveReportModal from "@/modules/dashboard/admin/modal/reports/ResolveReportModal";

export function getReportsColumns(
  handleOpenModal: <P>(component: ComponentType<P>, props?: P) => void
): ColumnDef<Report>[] {
  return [
    {
      accessorKey: "reporter",
      header: "Reporter",
      cell: ({ row }) => {
        const reporter = row.original.reporter;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-[#0C0C0C]">
              {reporter?.name || "Unknown"}
            </span>
            <span className="text-sm text-[#717171]">{reporter?.email || "—"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "reported",
      header: "Reported User",
      cell: ({ row }) => {
        const reported = row.original.reported;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-[#0C0C0C]">
              {reported?.name || "Unknown"}
            </span>
            <span className="text-sm text-[#717171]">{reported?.email || "—"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.category;
        const categoryLabels: Record<string, string> = {
          spam: "Spam",
          harassment: "Harassment",
          inappropriate_content: "Inappropriate Content",
          fake_account: "Fake Account",
          copyright: "Copyright",
          other: "Other",
        };
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
            {categoryLabels[category] || category}
          </span>
        );
      },
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => {
        const reason = truncateText(row.original.reason, 50);
        return (
          <span className="text-[#0C0C0C] max-w-xs truncate" title={reason}>
            {reason}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isResolved = row.original.resolved;
        return (
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              isResolved
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isResolved ? "Resolved" : "Pending"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Reported At",
      cell: ({ row }) => {
        return (
          <span className="text-[#717171] text-sm">
            {timeAgo(row.original.createdAt)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const report = row.original;
        return (
          <div className="flex gap-2">
            <Tooltip text="View Details" position="top">
              <button
                onClick={() => handleOpenModal(ViewReportModal, { report })}
                className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
              >
                <Eye size={16} />
              </button>
            </Tooltip>
            {!report.resolved && (
              <Tooltip text="Resolve Report" position="top">
                <button
                  onClick={() => handleOpenModal(ResolveReportModal, { report })}
                  className="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"
                >
                  <CheckCircle2 size={16} />
                </button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
}

