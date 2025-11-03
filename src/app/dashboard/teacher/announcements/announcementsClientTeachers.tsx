"use client";

import { Announcement } from "@/app/types/announcement";
import { useAllAnnouncementsData } from "@/hooks/useUser";
import AnnouncementBox, {
  AnnouncementPriority,
} from "@/modules/dashboard/teacher/AnnouncementsBox";
import { useEffect, useState } from "react";

export default function AnnouncementsClientTeachers() {
  const [selected, setSelected] = useState<Announcement | null>(null);
  const { AllAnnouncements, isLoading, isSuccess, isError } =
    useAllAnnouncementsData();

  useEffect(() => {
    if (AllAnnouncements?.data) {
      setSelected(AllAnnouncements?.data[0]);
    }
  }, [AllAnnouncements]);
  if (!AllAnnouncements?.data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-4">
      {/* Sidebar */}
      <div className="bg-[#FDFDFD] rounded-[22px] py-6 px-7 min-h-screen overflow-y-scroll scrollbar-hide flex flex-col">
        <h4 className="text-[#0C0C0C] text-xl font-medium mb-5">
          Announcement Board
        </h4>
        <div className="flex flex-col gap-5">
          {AllAnnouncements?.data.map(
            (announcement: Announcement, idx: number) => (
              <AnnouncementBox
                key={idx}
                announcement={announcement as Announcement}
                onClick={() => setSelected(announcement as Announcement)}
                selectedId={selected?.id || ""}
              />
            )
          )}
        </div>
      </div>

      {/* Right side content */}
      <div className="bg-white rounded-[22px] py-8 px-[41px] shadow-sm min-h-screen">
        {selected ? (
          <div className="flex flex-col">
            <h4 className=" text-[#0c0c0c] text-xl font-medium mb-8">
              Details View
            </h4>
            <div className="flex flex-col   rounded-lg p-3">
              {/* Header */}
              <div className="flex flex-row justify-between items-center mb-2">
                <div className="flex flex-col text-left">
                  <div className="flex flex-row items-center">
                    <div className="w-[7px] h-[7px] rounded-full bg-[#368FFF]"></div>
                    <p className="pl-[10px] text-[#0C0C0C] text-[15px] font-medium">
                      {selected.title}
                    </p>
                  </div>
                  <span className="pl-[14px] text-[13px] font-normal text-[#717171]">
                    {selected?.createdAt
                      ? new Date(selected?.createdAt).toLocaleDateString()
                      : "No Date"}
                  </span>
                </div>
                <AnnouncementPriority priority={selected.priority!} />
              </div>

              {/* Preview content */}
              <p className="pl-[14px] text-[#717171] text-sm ">
                {selected.content}
              </p>
            </div>
            {/* <h3 className="text-xl font-semibold mb-2">{selected.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{selected.createdAt}</p>
            <AnnouncementPriority priority={selected.priority} />
            <p className="mt-4 text-gray-700 leading-relaxed">
              {selected.content}
            </p> */}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-20">
            Select an announcement to view details
          </p>
        )}
      </div>
    </div>
  );
}
