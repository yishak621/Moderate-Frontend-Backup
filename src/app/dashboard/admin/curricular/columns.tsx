import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Users } from "lucide-react";
import type { ComponentType } from "react";
import { Curricular } from "@/app/types/curricular";
import EditCurricularAreaModal from "@/modules/dashboard/admin/modal/curricular/EditCurricularAreaModal";
import DeleteCurricularAreaModal from "@/modules/dashboard/admin/modal/curricular/DeleteCurricularAreaModal";
import { EmailDomains } from "@/app/types/emailDomains";
import EditEmailDomainModal from "@/modules/dashboard/admin/modal/emailDomain/EditEmailDomainModal";
import DeleteEmailDomainModal from "@/modules/dashboard/admin/modal/emailDomain/DeleteEmailDomainModal";

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
      accessorKey: "Description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-[#0C0C0C]">{row.original.description}</span>
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
      accessorKey: "Documents",
      header: "Documents",
      cell: ({ row }) => (
        <span className="text-[#0C0C0C]">{row.original.posts}</span>
      ),
    },

    {
      accessorKey: "Status",
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleOpenModal(EditCurricularAreaModal)}
              className="p-1 text-green-500 hover:bg-green-50 rounded"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() =>
                handleOpenModal(DeleteCurricularAreaModal, {
                  Curricular: row.original.name,
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

export function getEmailDomainsColumns(
  handleOpenModal: <P>(component: ComponentType<P>, props?: P) => void
): ColumnDef<EmailDomains>[] {
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
        <span className="text-[#0C0C0C]">{row.original.schoolName}</span>
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
      accessorKey: "Added Date",
      header: "Added Date",
      cell: ({ row }) => (
        <span className="text-[#0C0C0C]">{row.original.createdDate}</span>
      ),
    },

    {
      accessorKey: "Status",
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleOpenModal(EditEmailDomainModal)}
              className="p-1 text-green-500 hover:bg-green-50 rounded"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() =>
                handleOpenModal(DeleteEmailDomainModal, {
                  Curricular: row.original.emailDomain,
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
