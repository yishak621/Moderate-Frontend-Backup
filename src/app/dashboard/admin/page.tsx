import type { Metadata } from "next";
import AdminPage from "./adminClient";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Access your admin dashboard on Moderate Tech. Manage users, curricular areas, announcements, support messages, and system settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
      <AdminPage />
    </>
  );
}
