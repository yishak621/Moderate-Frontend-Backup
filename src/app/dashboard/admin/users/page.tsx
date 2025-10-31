import type { Metadata } from "next";
import UsersClient from "./usersClient";

export const metadata: Metadata = {
  title: "User Management",
  description:
    "Manage users on Moderate Tech. View, add, edit, and manage teacher and student accounts.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
    <UsersClient/>
    </>
  )
}
