import type { Metadata } from "next";
import AnnouncementClient from "./announcementsClient";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "Manage school-wide announcements on Moderate Tech. Create, edit, and publish announcements for all users.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
      <AnnouncementClient />
    </>
  );
}
