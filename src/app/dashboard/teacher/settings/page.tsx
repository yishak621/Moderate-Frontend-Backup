import type { Metadata } from "next";
import SettingsClientTeachers from "./SettingsClientTeachers";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Manage your teacher account settings on Moderate Tech. Configure preferences, notifications, and account options.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <>
      <SettingsClientTeachers />
    </>
  );
}
