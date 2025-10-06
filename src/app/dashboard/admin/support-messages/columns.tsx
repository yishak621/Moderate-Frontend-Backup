"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MessageSquare } from "lucide-react";
import type { ComponentType } from "react";

import { Support } from "@/app/types/support";

export function getAnnouncementColumns(
  handleOpenModal: <P>(component: ComponentType<P>, props?: P) => void
): ColumnDef<Support>[] {
  return [
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <span className="text-[#0C0C0C] font-normal">
          {row.original.subject}
        </span>
      ),
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#0C0C0C]">
            {row.original.user?.name}
          </span>
          <span className="text-sm text-[#717171] block max-w-[200px] truncate">
            {row.original.user?.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type;
        const colorMap: Record<string, string> = {
          General: "border-green-700 bg-green-100 text-green-700",
          System: "border-red-700 bg-red-100 text-red-700",
          Feature: "border-yellow-700 bg-yellow-100 text-yellow-700",
        };
        return (
          <span
            className={`px-4.5 py-2 text-sm font-semibold rounded-full ${colorMap[type]}`}
          >
            {type}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const priority = row.original.status;
        const colorMap: Record<string, string> = {
          Resolved: "bg-green-100 text-green-700",
          Opened: "bg-blue-100 text-blue-700",
          In_progress: "bg-yellow-100 text-yellow-700",
        };
        return (
          <span
            className={`px-4.5 py-2 text-sm font-semibold rounded-full ${colorMap[priority]}`}
          >
            {priority}
          </span>
        );
      },
    },
    {
      accessorKey: "messages",
      header: "Messages",
      cell: ({ row }) => (
        <div className=" flex flex-row gap-1 items-center">
          <div>
            <MessageSquare size={18} className="text-[#717171]" />
          </div>{" "}
          <span className="text-[#0C0C0C] font-normal">
            {row.original.messages}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "last reply",
      header: "Last Reply",
      cell: ({ row }) => (
        <span className="text-[#717171] font-normal">
          {row.original.last_reply}
        </span>
      ),
    },
    {
      accessorKey: "created",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-[#717171] font-normal">
          {row.original.created instanceof Date
            ? row.original.created.toLocaleDateString()
            : String(row.original.created)}
        </span>
      ),
    },
  ];
}
