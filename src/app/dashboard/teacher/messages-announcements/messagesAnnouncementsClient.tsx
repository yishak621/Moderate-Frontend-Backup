"use client";

import MobileTabNavigation from "@/components/ui/MobileTabNavigation";
import MobileMessagesClient from "../messages/MobileMessagesClient";
import MobileAnnouncementsClient from "../announcements/MobileAnnouncementsClient";
import MessagesClientTeachers from "../messages/messagesClientTeachers";
import AnnouncementsClientTeachers from "../announcements/announcementsClientTeachers";
import { usePathname } from "next/navigation";

const tabs = [
  {
    id: "messages",
    label: "Messages",
    route: "/dashboard/teacher/messages-announcements/messages",
  },
  {
    id: "announcements",
    label: "Announcements",
    route: "/dashboard/teacher/messages-announcements/announcements",
  },
];

export default function MessagesAnnouncementsClient() {
  const pathname = usePathname();

  // Determine active tab from pathname
  const activeTab =
    pathname.includes("/announcements") ? "announcements" : "messages";

  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden flex flex-col h-screen bg-[#FDFDFD]">
        {/* Tab Navigation */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <MobileTabNavigation tabs={tabs} activeTab={activeTab} />
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "messages" ? (
            <MobileMessagesClient />
          ) : (
            <MobileAnnouncementsClient />
          )}
        </div>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r border-gray-200 pr-4">
            <h3 className="text-lg font-semibold mb-4">Messages</h3>
            <MessagesClientTeachers />
          </div>
          <div className="pl-4">
            <h3 className="text-lg font-semibold mb-4">Announcements</h3>
            <AnnouncementsClientTeachers />
          </div>
        </div>
      </div>
    </>
  );
}

