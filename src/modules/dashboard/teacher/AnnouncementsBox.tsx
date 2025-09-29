"use client";
import { AnnouncementBoxProps } from "@/types/announcement.type";

export default function AnnouncementBox({
  announcement,
  onClick,
}: AnnouncementBoxProps & { onClick: () => void }) {
  const { title, content, createdAt, priority } = announcement;

  return (
    <div
      onClick={onClick}
      className="flex flex-col cursor-pointer transition-all hover:bg-gray-50 rounded-lg p-3"
    >
      {/* Header */}
      <div className="flex flex-row justify-between items-center mb-2">
        <div className="flex flex-col text-left">
          <div className="flex flex-row items-center">
            <div className="w-[7px] h-[7px] rounded-full bg-[#368FFF]"></div>
            <p className="pl-[10px] text-[#0C0C0C] text-[15px] font-medium">
              {title}
            </p>
          </div>
          <span className="pl-[14px] text-[13px] font-normal text-[#717171]">
            {createdAt}
          </span>
        </div>
        <AnnouncementPriority priority={priority} />
      </div>

      {/* Preview content */}
      <p className="pl-[14px] text-[#444] text-sm line-clamp-2">{content}</p>
    </div>
  );
}

export function AnnouncementPriority({ priority }: { priority: string }) {
  const colors: Record<typeof priority, string> = {
    HIGH: "text-red-600 border-red-600",
    MEDIUM: "text-yellow-600 border-yellow-600",
    NORMAL: "text-green-600 border-green-600",
  };

  return (
    <div className={`border py-1.5 px-3.5 rounded-[47px] ${colors[priority]}`}>
      {priority}
    </div>
  );
}
