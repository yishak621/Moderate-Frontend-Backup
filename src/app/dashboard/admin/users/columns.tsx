import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, Settings } from "lucide-react";

export type User = {
  id: string;
  name: string;
  email: string;
  curricular: string;
  status: "Active" | "Suspended" | "Inactive";
  subscription: "free" | "Monthly" | "Yearly";
  lastActive: string;
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "teacher",
    header: "Teacher",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-[#0C0C0C]">{row.original.name}</span>
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
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
          <Eye size={16} />
        </button>
        <button className="p-1 text-green-500 hover:bg-green-50 rounded">
          <Pencil size={16} />
        </button>
        <button className="p-1 text-red-500 hover:bg-red-50 rounded">
          <Trash2 size={16} />
        </button>
        <button className="p-1 text-gray-500 hover:bg-gray-50 rounded">
          <Settings size={16} />
        </button>
      </div>
    ),
  },
];
