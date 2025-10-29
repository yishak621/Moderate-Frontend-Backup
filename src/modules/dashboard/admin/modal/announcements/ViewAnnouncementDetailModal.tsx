"use client";
import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { Announcement } from "@/app/types/announcement";
import { Domain } from "@/app/types/user";

export default function ViewAnnouncementDetailModal({
  announcement: data,
}: {
  announcement: Announcement;
}) {
  const { close } = useModal();
  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };

  return (
    <div className=" bg-[#FDFDFD] w-full min-w-[700px] p-10 rounded-[27px] flex flex-col max-h-screen overflow-y-scroll scrollbar-hide">
      <div onClick={close} className=" absolute right-0 top-0 py-3 px-3">
        <X width={22} height={22} className="text-[#000000] cursor-pointer" />
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{data.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Created on {new Date(data.createdAt || "null").toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Updated on {new Date(data.updatedAt || "null").toLocaleDateString()}
          </p>
        </div>

        <div
          className={`px-4 py-1.5 text-sm font-medium rounded-full ${
            data.priority === "High"
              ? "bg-red-50 text-red-700 border border-red-200"
              : data.priority === "Medium"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {data.priority} Priority
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-4 mt-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
          Content
        </h3>
        <p className="text-gray-800 leading-relaxed break-words whitespace-pre-line">
          {data.content}
        </p>
      </div>

      {/* Meta Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
            Start Date
          </h4>
          <p className="text-gray-800">
            {new Date(data.startDate || "null").toLocaleDateString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
            Expire Date
          </h4>
          <p className="text-gray-800">
            {new Date(data.expireDate || "null").toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Type Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase m-2">
          Announcement Types
        </h3>
        <div className="flex flex-wrap gap-2">
          {(data.type ?? []).map((t: string, i: number) => (
            <span
              key={i}
              className="px-4 py-1.5 text-sm bg-[#368FFF]/10 text-[#368FFF] border border-[#368FFF]/20 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Domains Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase mt-2">
          Target Domains
        </h3>
        <div className="flex flex-wrap gap-2">
          {data?.domains?.map((d: Domain) => (
            <span
              key={d.id}
              className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full border border-gray-200"
            >
              {d.name}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between gap-3 text-sm text-gray-500">
        <p>Announcement ID: {data.id}</p>
        <p>Created by: {data.createdBy}</p>
      </div>
    </div>
  );
}
