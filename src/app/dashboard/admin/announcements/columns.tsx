"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Pencil,
  Trash2,
  Mail,
  EyeIcon,
  TriangleAlert,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";
import ViewUserModal from "@/modules/dashboard/admin/modal/users/ViewUserModal";
import EditUserModal from "@/modules/dashboard/admin/modal/users/EditUserModal";
import DeleteUserModal from "@/modules/dashboard/admin/modal/users/DeleteUserModal";
import SettingsUserModal from "@/modules/dashboard/admin/modal/users/MessageUserModal";
import { Announcement } from "@/app/types/announcement";
import EditAnnouncementModal from "@/modules/dashboard/admin/modal/announcements/EditAnnouncement";
import DeleteAnnouncementModal from "@/modules/dashboard/admin/modal/announcements/DeleteAnnouncementModal";
import ViewAnnouncementDetailModal from "@/modules/dashboard/admin/modal/announcements/ViewAnnouncementDetailModal";

export function getAnnouncementColumns(
  handleOpenModal: <P>(component: ComponentType<P>, props?: P) => void
): ColumnDef<Announcement>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#0C0C0C]">
            {row.original.title}
          </span>
          <span className="text-sm text-[#717171] block max-w-[200px] truncate">
            {row.original.content}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type || ["General"];
        const colorMap: Record<string, string> = {
          General: "bg-green-100 text-green-700",
          System: "bg-red-100 text-red-700",
          Feature: "bg-yellow-100 text-yellow-700",
          Announcement: "bg-blue-100 text-blue-700",
          Newsletter: "bg-gray-100 text-gray-700",
          Report: "bg-orange-100 text-orange-700",
        };
        return (
          <div className="flex flex-col gap-1 items-start">
            {type.map((t, idx) => {
              return (
                <span
                  key={idx}
                  className={`px-4.5 py-2 text-sm font-semibold rounded-full ${colorMap[t]}`}
                >
                  {t}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.original.priority || "Low";
        const colorMap: Record<string, string> = {
          Medium: "bg-green-100 text-green-700",
          High: "bg-red-100 text-red-700",
          Low: "bg-yellow-100 text-yellow-700",
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
      accessorKey: "audience",
      header: "Audience",
      cell: ({ row }) => {
        const domains = row.original.domains;
        const targetAudience = row.original.targetAudience;
        return (
          <div className="flex flex-col gap-1">
            {domains && domains.length > 0 ? (
              domains.map((domain, idx) => (
                <span key={idx} className="text-[#0C0C0C] font-normal">
                  {domain?.name}
                </span>
              ))
            ) : targetAudience === "All" ? (
              <span className="text-[#0C0C0C] font-normal">All</span>
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "Published";
        const colorMap: Record<string, string> = {
          Published: "bg-green-100 text-green-700",
          Archived: "bg-red-100 text-red-700",
          Draft: "bg-yellow-100 text-yellow-700",
        };
        return (
          <div
            className={`flex flex-row gap-1 items-center justify-center px-1.5 py-2 text-sm font-semibold rounded-full ${colorMap[status]}`}
          >
            <div>
              {status === "published" ? (
                <EyeIcon size={18} />
              ) : (
                <TriangleAlert size={18} />
              )}
            </div>{" "}
            <span>{status}</span>
          </div>
        );
      },
    },

    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => (
        <div className="flex flex-row gap-1 items-center justify-center text-gray-700">
          <div>
            {" "}
            <Users size={18} className="text-[#717171]" />{" "}
          </div>
          <span className=" text-[#0C0C0C]">
            {" "}
            {row.original.views || "soon"}
          </span>
        </div>
      ),
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const announcement = row.original;
        return (
          <div className="flex gap-2">
            <button
              onClick={() =>
                handleOpenModal(ViewAnnouncementDetailModal, { announcement })
              }
              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() =>
                handleOpenModal(EditAnnouncementModal, { announcement })
              }
              className="p-1 text-green-500 hover:bg-green-50 rounded"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() =>
                handleOpenModal(DeleteAnnouncementModal, { announcement })
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
