"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MessageSquare } from "lucide-react";
import type { ComponentType } from "react";

import { Support } from "@/app/types/support";
import { timeAgo } from "@/lib/timeAgo";
import Link from "next/link";
import MarkAsAResolvedModal from "@/modules/dashboard/admin/modal/support/MarkAsAResolvedModal";

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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const priority = row.original.status;
        const colorMap: Record<string, string> = {
          closed: "bg-green-100 text-green-700",
          open: "bg-blue-100 text-blue-700",
          pending: "bg-yellow-100 text-yellow-700",
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
      accessorKey: "last reply",
      header: "Last Reply",
      cell: ({ row }) => (
        <span className="text-[#717171] font-normal">
          {timeAgo(row.original.lastMessageAt)}
        </span>
      ),
    },
    {
      accessorKey: "created",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-[#717171] font-normal">
          {timeAgo(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: "Actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {/* Open Ticket Button */}
          <Link
            href={`/dashboard/admin/support-messages/messages?ticketId=${row.original.id}`}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border border-[#D0E3FF] text-[#1D75E8] hover:bg-[#E8F1FF] transition"
          >
            <span>Open</span>
          </Link>

          {/* Resolve Button */}
          {row.original.status !== "closed" && (
            <button
              onClick={() =>
                handleOpenModal(MarkAsAResolvedModal, { ticket: row.original })
              }
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-[#22C55E]/10 text-[#16A34A] hover:bg-[#16A34A]/20 transition"
            >
              <span>Resolve</span>
            </button>
          )}
        </div>
      ),
    },
  ];
}
