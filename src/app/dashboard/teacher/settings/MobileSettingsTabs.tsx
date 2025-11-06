"use client";

import { usePathname, useRouter } from "next/navigation";
import { Pencil, PenLine } from "lucide-react";
import MobileTabNavigation from "@/components/ui/MobileTabNavigation";
import SettingsContent from "./SettingsContent";
import HistoryContent from "@/app/dashboard/teacher/history/HistoryContent";
import SupportContent from "@/app/dashboard/teacher/support/SupportContent";
import UserAvatar from "@/components/UserAvatar";
import { useUserData } from "@/hooks/useUser";

const tabs = [
  {
    id: "settings",
    label: "Settings",
    route: "/dashboard/teacher/settings",
  },
  {
    id: "history",
    label: "History",
    route: "/dashboard/teacher/history",
  },
  {
    id: "support",
    label: "Support",
    route: "/dashboard/teacher/support",
  },
];

export default function MobileSettingsTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useUserData();

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname.includes("/history")) return "history";
    if (pathname.includes("/support")) return "support";
    return "settings";
  };

  const activeTab = getActiveTab();

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "history":
        return <HistoryContent />;
      case "support":
        return <SupportContent />;
      case "settings":
      default:
        return <SettingsContent />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Profile Section */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex flex-col items-center gap-3">
          {/* Profile Image with Edit Button and text via UserAvatar */}
          <UserAvatar
            profilePictureUrl={user?.profilePictureUrl}
            name={user?.name}
            email={user?.email || ""}
            size="lg"
            withText
            nameFontSizePx={15}
            nameColor="#0C0C0C"
            emailFontSizePx={14}
            emailColor="#717171"
            whiteRingPx={7}
            whiteRingColor="#FFFFFF"
            overlay={
              <button
                onClick={() => router.push("/dashboard/teacher/profile")}
                className="bg-[#368FFF] text-white rounded-full p-2.5 shadow-md hover:bg-[#2a7ae8] transition-colors"
                aria-label="Edit profile"
              >
                <PenLine size={10} />
              </button>
            }
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-20  border-gray-200 ">
        <MobileTabNavigation tabs={tabs} activeTab={activeTab} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">{renderContent()}</div>
    </div>
  );
}
