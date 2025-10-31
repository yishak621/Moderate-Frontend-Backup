import type { Metadata } from "next";
import AdminSettingClient from "./adminSettingsClient";

export const metadata: Metadata = {
  title: "App Settings",
  description:
    "Manage application settings on Moderate Tech. Configure system-wide settings, preferences, and platform options.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
      <AdminSettingClient />
    </>
  );
}
