"use client";

import { Announcement } from "@/app/types/announcement";
import { useAllAnnouncementsData } from "@/hooks/useUser";
import AnnouncementBox, {
  AnnouncementPriority,
} from "@/modules/dashboard/teacher/AnnouncementsBox";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import SectionLoading from "@/components/SectionLoading";
import { EmptyState } from "@/components/EmptyStateProps";
import { useEffect } from "react";
import MobileTabNavigation from "@/components/ui/MobileTabNavigation";

const tabs = [
  {
    id: "messages",
    label: "Messages",
    route: "/dashboard/teacher/messages",
  },
  {
    id: "announcements",
    label: "Announcements",
    route: "/dashboard/teacher/announcements",
  },
];

export default function MobileAnnouncementsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const announcementId = searchParams.get("id");
  const [selected, setSelected] = useState<Announcement | null>(null);
  const { AllAnnouncements, isLoading, isSuccess, isError } =
    useAllAnnouncementsData();

  // Set selected announcement from URL only (no auto-select)
  useEffect(() => {
    if (announcementId && AllAnnouncements?.data) {
      const found = AllAnnouncements.data.find(
        (ann: Announcement) => ann.id === announcementId
      );
      if (found) {
        setSelected(found);
      } else {
        setSelected(null);
      }
    } else {
      setSelected(null);
    }
  }, [announcementId, AllAnnouncements]);

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelected(announcement);
    router.push(`/dashboard/teacher/announcements?id=${announcement.id}`);
  };

  const handleBack = () => {
    setSelected(null);
    router.push("/dashboard/teacher/announcements");
  };

  if (!AllAnnouncements?.data) {
    if (isLoading) return <SectionLoading />;
    return <EmptyState />;
  }

  // Show detail view if announcement is selected
  if (selected) {
    return (
      <div className="flex flex-col h-screen ">
        {/* Tab Navigation */}
        <div className="sticky top-0 z-20  border-b border-gray-200">
          <MobileTabNavigation tabs={tabs} />
        </div>

        {/* Header with Back Button */}
        {/* 
        <button
          onClick={handleBack}
          className="p-2 self-start hover:bg-gray-100 rounded-full transition-colors bg-[#FDFDFD]"
        >
          <ArrowLeft size={20} className="text-[#0C0C0C]" />
        </button> */}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="flex flex-col rounded-lg p-4 bg-white shadow-sm">
            {/* Header */}
            <div className="flex flex-row justify-between items-center mb-4">
              <div className="flex flex-col text-left flex-1 min-w-0">
                <div className="flex flex-row items-center">
                  <div className="w-[7px] h-[7px] rounded-full bg-[#368FFF]"></div>
                  <p className="pl-[10px] text-[#0C0C0C] text-lg font-medium">
                    {selected.title}
                  </p>
                </div>
                <span className="pl-[14px] text-sm font-normal text-[#717171]">
                  {selected?.createdAt
                    ? new Date(selected?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "No Date"}
                </span>
              </div>
              {selected.priority && (
                <AnnouncementPriority priority={selected.priority} />
              )}
            </div>

            {/* Content */}
            <div className="pl-[14px] bg-[#FDFDFD] rounded-lg p-4">
              <p className="text-[#717171] text-base leading-relaxed whitespace-pre-wrap">
                {selected.content}
              </p>

              <button
                onClick={handleBack}
                className="p-4 mt-[39px] flex justify-center items-center gap-2  w-full hover:bg-gray-100 border border-[#DBDBDB] rounded-[75px] transition-colors bg-[#FDFDFD]"
              >
                <ArrowLeft size={20} className="text-[#0C0C0C]" />
                <p className="text-[#0C0C0C] text-sm font-medium">Back</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show list view
  return (
    <div className="flex flex-col h-screen ">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-20  border-b border-gray-200">
        <MobileTabNavigation tabs={tabs} />
      </div>

      {/* Announcements List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <SectionLoading />
        ) : AllAnnouncements?.data?.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            {((AllAnnouncements?.data as Announcement[]) || []).map(
              (announcement, idx: number) => (
                <div
                  key={announcement?.id || idx}
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  <AnnouncementBox
                    announcement={announcement}
                    onClick={() => handleAnnouncementClick(announcement)}
                    selectedId={(selected as Announcement | null)?.id || ""}
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
