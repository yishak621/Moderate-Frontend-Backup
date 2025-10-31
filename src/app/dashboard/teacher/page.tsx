import type { Metadata } from "next";
import UserClient from "./teacherClient";

export const metadata: Metadata = {
  title: "Teacher Dashboard",
  description:
    "Access your teacher dashboard on Moderate Tech. Manage grading, posts, announcements, messages, and student interactions all in one place.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
      <UserClient />
    </>
  );
}
