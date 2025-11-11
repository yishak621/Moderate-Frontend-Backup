"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import type { ComponentType } from "react";
import { Appeal } from "@/types/moderation";
import { timeAgo } from "@/lib/timeAgo";
import Tooltip from "@/components/ui/Tooltip";
import ViewAppealModal from "@/modules/dashboard/admin/modal/appeals/ViewAppealModal";
import ReviewAppealModal from "@/modules/dashboard/admin/modal/appeals/ReviewAppealModal";
import { truncateText } from "@/lib/truncateText";

export function getAppealsColumns(
  handleOpenModal: <P>(component: ComponentType<P>, props?: P) => void
): ColumnDef<Appeal>[] {
  return [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-[#0C0C0C]">
              {user?.name || "Unknown"}
            </span>
            <span className="text-sm text-[#717171]">{user?.email || "—"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "reason",
      header: "Appeal Reason",
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
        const status = row.original.status;
        const statusConfig: Record<
          string,
          { label: string; className: string }
        > = {
          pending: {
            label: "Pending",
            className: "bg-yellow-100 text-yellow-700",
          },
          accepted: {
            label: "Accepted",
            className: "bg-green-100 text-green-700",
          },
          rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${config.className}`}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Appealed At",
      cell: ({ row }) => {
        return (
          <span className="text-[#717171] text-sm">
            {timeAgo(row.original.createdAt)}
          </span>
        );
      },
    },
    {
      accessorKey: "reviewedAt",
      header: "Reviewed At",
      cell: ({ row }) => {
        const reviewedAt = row.original.reviewedAt;
        if (!reviewedAt) return <span className="text-[#717171]">—</span>;
        return (
          <span className="text-[#717171] text-sm">{timeAgo(reviewedAt)}</span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const appeal = row.original;
        const isPending = appeal.status === "pending";
        return (
          <div className="flex gap-2">
            <Tooltip text="View Details" position="top">
              <button
                onClick={() => handleOpenModal(ViewAppealModal, { appeal })}
                className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
              >
                <Eye size={16} />
              </button>
            </Tooltip>
            {isPending && (
              <Tooltip text="Review Appeal" position="top">
                <button
                  onClick={() => handleOpenModal(ReviewAppealModal, { appeal })}
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
