"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";
import type { ComponentType } from "react";

import { Support } from "@/app/types/support";
import { Setting } from "@/types/admin.type";
import EditBasicSiteSettingsModal from "@/modules/dashboard/admin/modal/settings/EditBasicSiteSettingsModal";
import DeleteBasicSiteSettingsModal from "@/modules/dashboard/admin/modal/settings/DeleteBasicSiteSettingsModal";

export function getBasicSettingsColumns(
  handleOpenModal: <P>(component: ComponentType<P>, props?: P) => void
): ColumnDef<Setting>[] {
  return [
    {
      accessorKey: "key",
      header: "Key",
      cell: ({ row }) => (
        <span className="text-[#0C0C0C] font-normal">{row.original.key}</span>
      ),
    },
    {
      accessorKey: "Category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-[#0C0C0C] font-normal">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => {
        const values = row.original.value;

        return (
          <div className="flex flex-col gap-1">
            {values?.map((value, idx) => {
              return (
                <span key={idx} className="text-[#0C0C0C] font-normal">
                  {value}
                </span>
              );
            })}
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "CreatedAt",
      cell: ({ row }) => (
        <span className="text-[#717171] font-normal">
          {row.original.createdAt
            ? row.original.createdAt
            : String(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "UpdatedAt",
      cell: ({ row }) => (
        <span className="text-[#717171] font-normal">
          {row.original.updatedAt
            ? row.original.updatedAt
            : String(row.original.updatedAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <button
              onClick={() =>
                handleOpenModal(EditBasicSiteSettingsModal, {
                  BasicSetting: row.original,
                })
              }
              className="p-1 text-green-500 hover:bg-green-50 rounded"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() =>
                handleOpenModal(DeleteBasicSiteSettingsModal, {
                  BasicSetting: row.original,
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
