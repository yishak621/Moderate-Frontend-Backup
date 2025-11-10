"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, Mail } from "lucide-react";
import type { ComponentType } from "react";
import ViewUserModal from "@/modules/dashboard/admin/modal/users/ViewUserModal";
import EditUserModal from "@/modules/dashboard/admin/modal/users/EditUserModal";
import DeleteUserModal from "@/modules/dashboard/admin/modal/users/DeleteUserModal";
import MessageUserModal from "@/modules/dashboard/admin/modal/users/MessageUserModal";
import { User } from "@/app/types/user";
import { timeAgo } from "@/lib/timeAgo";
import Tooltip from "@/components/ui/Tooltip";

export function getUserColumns(
  handleOpenModal: <P>(component: ComponentType<P>, props?: P) => void
): ColumnDef<User>[] {
  return [
    {
      accessorKey: "teacher",
      header: "Teacher",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#0C0C0C]">
            {row.original.name}
          </span>
          <span className="text-sm text-[#717171]">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "curricular",
      header: "Curricular Area",
      cell: ({ row }) => (
        <span className="text-[#0C0C0C]">
          {row.original.domains?.map((d) => d.name).join(", ") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.verificationStatus || "inactive";
        const colorMap: Record<string, string> = {
          active: "bg-green-100 text-green-700",
          suspended: "bg-red-100 text-red-700",
          inactive: "bg-gray-100 text-gray-700",
        };
        return (
          <span
            className={`px-4.5 py-2 text-sm font-semibold rounded-full ${colorMap[status]}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: "subscription",
      header: "Subscription",
      cell: ({ row }) => {
        const plan = row.original.subscriptionStatus || "free";
        const colorMap: Record<string, string> = {
          free: "bg-gray-100 text-gray-700",
          monthly: "bg-blue-100 text-blue-700",
          yearly: "bg-purple-100 text-purple-700",
        };
        return (
          <span
            className={`px-4.5 py-2 text-sm font-semibold rounded-full ${colorMap[plan]}`}
          >
            {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }) => (
        <span className="text-gray-700">
          {row.original?.lastSeen ? timeAgo(row.original?.lastSeen) : "Never"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
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
            <Tooltip text="Edit User" position="top">
              <button
                onClick={() => handleOpenModal(EditUserModal, { user })}
                className="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"
              >
                <Pencil size={16} />
              </button>
            </Tooltip>
            <Tooltip text="Send Message" position="top">
              <button
                onClick={() => handleOpenModal(MessageUserModal, { user })}
                className="p-1 text-gray-500 hover:bg-gray-50 rounded transition-colors"
              >
                <Mail size={16} />
              </button>
            </Tooltip>
            <Tooltip text="Delete User" position="top">
              <button
                onClick={() => handleOpenModal(DeleteUserModal, { user })}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
}
