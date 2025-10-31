import type { Metadata } from "next";
import TeacherProfileClient from "./TeacherProfileClient";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "View and edit your teacher profile on Moderate Tech. Manage your personal information and account details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <>
      <TeacherProfileClient />
    </>
  );
}
