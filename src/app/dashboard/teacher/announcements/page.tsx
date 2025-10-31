import type { Metadata } from "next";
import AnnouncementsClientTeachers from "./announcementsClientTeachers";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "View and manage announcements on Moderate Tech. Stay updated with school-wide and class-specific announcements.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <>
      <AnnouncementsClientTeachers />
    </>
  );
}
