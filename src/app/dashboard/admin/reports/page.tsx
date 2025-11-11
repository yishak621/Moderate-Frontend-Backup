import type { Metadata } from "next";
import ReportsClient from "./reportsClient";

export const metadata: Metadata = {
  title: "Reports Management",
  description:
    "Manage user reports on Moderate Tech. View, resolve, and track reports against users.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
      <ReportsClient />
    </>
  );
}

