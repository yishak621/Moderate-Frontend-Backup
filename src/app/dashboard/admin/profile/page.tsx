import type { Metadata } from "next";
import AdminProfileClient from "./AdminProfileClient";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "View and edit your admin profile on Moderate Tech. Manage your personal information and administrative account details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <>
      <AdminProfileClient />
    </>
  );
}
