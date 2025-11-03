"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Users } from "lucide-react";
import type { ComponentType } from "react";
import { Curricular } from "@/app/types/curricular";
import EditCurricularAreaModal from "@/modules/dashboard/admin/modal/curricular/EditCurricularAreaModal";
import DeleteCurricularAreaModal from "@/modules/dashboard/admin/modal/curricular/DeleteCurricularAreaModal";

export function getCurricularColumns(
  handleOpenModal: <P>(component: ComponentType<P>, props?: P) => void
): ColumnDef<Curricular>[] {
  return [
    {
      accessorKey: "Curricular Area Name",
      header: "Curricular Area Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#0C0C0C]">
            {row.original.name}
          </span>
        </div>
      ),
    },

    {
      accessorKey: "Teachers",
      header: "Teachers",
      cell: ({ row }) => (
        <div className=" flex flex-row gap-2 text-[#0C0C0C]">
          <Users size={18} className="text-[#717171]" />
          <span>{row.original.teachers}</span>
        </div>
      ),
    },
    {
      accessorKey: "Posts",
      header: "Posts",
      cell: ({ row }) => (
        <span className="text-[#0C0C0C]">{row.original.posts}</span>
      ),
    },

    {
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "active";
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
                handleOpenModal(EditCurricularAreaModal, {
                  Curricular: row.original,
                })
              }
              className="p-1 text-green-500 hover:bg-green-50 rounded"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() =>
                handleOpenModal(DeleteCurricularAreaModal, {
                  Curricular: row.original,
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
