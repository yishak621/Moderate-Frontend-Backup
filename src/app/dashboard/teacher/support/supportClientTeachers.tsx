"use client";

import MobileSettingsTabs from "@/app/dashboard/teacher/settings/MobileSettingsTabs";
import SupportContent from "./SupportContent";

export default function SupportClientTeachers() {
  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileSettingsTabs />
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <SupportContent />
      </div>
    </>
  );
}
