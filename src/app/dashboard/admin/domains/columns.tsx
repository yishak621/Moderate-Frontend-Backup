"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Users } from "lucide-react";
import type { ComponentType } from "react";
import EditEmailDomainModal from "@/modules/dashboard/admin/modal/emailDomain/EditEmailDomainModal";
import DeleteEmailDomainModal from "@/modules/dashboard/admin/modal/emailDomain/DeleteEmailDomainModal";
import { AllowedEmailDomainAttributes } from "@/types/typeLog";

export function getEmailDomainsColumns(
  handleOpenModal: <P>(component: ComponentType<P>, props?: P) => void
): ColumnDef<AllowedEmailDomainAttributes>[] {
  return [
    {
      accessorKey: "Email Domain",
      header: "Email Domain",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#0C0C0C]">
            {row.original.emailDomain}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "School Name",
      header: "School Name",
      cell: ({ row }) => (
        <div
          className="
        text-[#0C0C0C] 
        block 
        max-w-[250px] md:max-w-[180px] sm:max-w-[120px] 
        truncate overflow-hidden text-ellipsis
      "
          title={row.original.name} // tooltip for full text
        >
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "Category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-[#0C0C0C]">{row.original.category}</span>
      ),
    },
    {
      accessorKey: "Teachers",
      header: "Teachers",
      cell: ({ row }) => (
        <div className=" flex flex-row gap-2 text-[#0C0C0C]">
          <Users size={18} className="text-[#717171]" />
          <span>{row.original.teachers || "0"}</span>
        </div>
      ),
    },
    {
      accessorKey: "Added Date",
      header: "Added Date",
      cell: ({ row }) => (
        <span className="text-[#0C0C0C]">{row.original.createdAt}</span>
      ),
    },

    {
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }) => {
        const status = "active";
        const colorMap: Record<string, string> = {
          active: "bg-green-100 text-green-700",
          inactive: "bg-red-100 text-red-700",
        };
        return (
          <span
            className={`px-4.5 py-2 text-sm font-semibold rounded-full ${colorMap[status]}`}
          >
            {status || "active"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <button
              onClick={() =>
                handleOpenModal(EditEmailDomainModal, {
                  EmailDomain: row.original,
                })
              }
              className="p-1 text-green-500 hover:bg-green-50 rounded"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() =>
                handleOpenModal(DeleteEmailDomainModal, {
                  EmailDomain: row.original,
                })
              }
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
