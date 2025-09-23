export type User = {
  id: string;
  name: string;
  email: string;
  curricular: string;
  status: "Active" | "Suspended" | "Inactive";
  subscription: "free" | "Monthly" | "Yearly";
  lastActive: string;
};

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, Settings, Mail } from "lucide-react";
import ViewUserModal from "@/modules/dashboard/admin/modal/users/ViewUserModal";
import EditUserModal from "@/modules/dashboard/admin/modal/users/EditUserModal";
import DeleteUserModal from "@/modules/dashboard/admin/modal/users/DeleteUserModal";
import SettingsUserModal from "@/modules/dashboard/admin/modal/users/SettingsUserModal";

export function getUserColumns(
  handleOpenModal: (component: React.FC<any>, props?: any) => void
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
        <span className="text-[#0C0C0C]">{row.original.curricular}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const colorMap: Record<string, string> = {
          Active: "bg-green-100 text-green-700",
          Inactive: "bg-red-100 text-red-700",
          pending: "bg-yellow-100 text-yellow-700",
        };
        return (
          <span
            className={`px-4.5 py-2 text-sm font-semibold rounded-full ${colorMap[status]}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "subscription",
      header: "Subscription",
      cell: ({ row }) => {
        const plan = row.original.subscription;
        const colorMap: Record<string, string> = {
          free: "bg-gray-100 text-gray-700",
          Monthly: "bg-blue-100 text-blue-700",
          Yearly: "bg-purple-100 text-purple-700",
        };
        return (
          <span
            className={`px-4.5 py-2 text-sm font-semibold rounded-full ${colorMap[plan]}`}
          >
            {plan}
          </span>
        );
      },
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.lastActive}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleOpenModal(ViewUserModal, { user })}
              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => handleOpenModal(EditUserModal, { user })}
              className="p-1 text-green-500 hover:bg-green-50 rounded"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleOpenModal(SettingsUserModal, { user })}
              className="p-1 text-gray-500 hover:bg-gray-50 rounded"
            >
              <Mail size={16} />
            </button>
            <button
              onClick={() => handleOpenModal(DeleteUserModal, { user })}
              className="p-1 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    },
  ];
}
