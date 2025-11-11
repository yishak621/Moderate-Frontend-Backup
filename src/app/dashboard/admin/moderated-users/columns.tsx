"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, AlertTriangle } from "lucide-react";
import type { ComponentType } from "react";
import { UserModeration } from "@/types/moderation";
import { timeAgo } from "@/lib/timeAgo";
import Tooltip from "@/components/ui/Tooltip";
import ViewUserModal from "@/modules/dashboard/admin/modal/users/ViewUserModal";
import { User } from "@/app/types/user";

export function getModeratedUsersColumns(
  handleOpenModal: <P>(component: ComponentType<P>, props?: P) => void
): ColumnDef<UserModeration>[] {
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusConfig: Record<
          string,
          { label: string; className: string }
        > = {
          active: { label: "Active", className: "bg-green-100 text-green-700" },
          suspended: {
            label: "Suspended",
            className: "bg-orange-100 text-orange-700",
          },
          banned: { label: "Banned", className: "bg-red-100 text-red-700" },
          pending_review: {
            label: "Pending Review",
            className: "bg-yellow-100 text-yellow-700",
          },
        };
        const config = statusConfig[status] || statusConfig.active;
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
      accessorKey: "violationCount",
      header: "Violations",
      cell: ({ row }) => {
        return (
          <span className="text-[#0C0C0C] font-medium">
            {row.original.violationCount || 0}
          </span>
        );
      },
    },
    {
      accessorKey: "suspensionEndDate",
      header: "Suspension End",
      cell: ({ row }) => {
        const endDate = row.original.suspendedUntil;
        if (!endDate) return <span className="text-[#717171]">—</span>;
        const isExpired = new Date(endDate) < new Date();
        return (
          <div className="flex flex-col">
            {isExpired ? (
              <span className="text-xs text-[#717171]">Expired</span>
            ) : (
              <span className="text-xs text-[#717171]">
                {new Date(endDate).toLocaleDateString()}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "banDate",
      header: "Ban Date",
      cell: ({ row }) => {
        const banDate = row.original.bannedAt;
        if (!banDate) return <span className="text-[#717171]">—</span>;
        return (
          <span className="text-sm text-red-600">
            {new Date(banDate).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
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
        const moderation = row.original;
        // Convert UserModeration to User for ViewUserModal
        const user: User = {
          id: moderation.userId,
          name: moderation.user?.name || "Unknown",
          email: moderation.user?.email || "",
        } as User;

        return (
          <div className="flex gap-2">
            <Tooltip text="View User Details" position="top">
              <button
                onClick={() => handleOpenModal(ViewUserModal, { user })}
                className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
              >
                <Eye size={16} />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
}
