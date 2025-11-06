"use client";

import MobileSettingsTabs from "@/app/dashboard/teacher/settings/MobileSettingsTabs";
import HistoryContent from "./HistoryContent";

export default function HistoryClientTeachers() {
  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileSettingsTabs />
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <HistoryContent />
      </div>
    </>
  );
}
