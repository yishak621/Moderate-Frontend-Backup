"use client";

import MobileSettingsClient from "./MobileSettingsClient";
import SettingsContent from "./SettingsContent";

export default function SettingsClientTeachers() {
  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileSettingsClient />
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <SettingsContent />
      </div>
    </>
  );
}
