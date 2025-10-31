import type { Metadata } from "next";
import SupportMessagesClient from "./supportMessagesClient";

export const metadata: Metadata = {
  title: "Support Messages",
  description:
    "View and manage your support messages on Moderate Tech. Track support requests and responses.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <>
      <SupportMessagesClient />
    </>
  );
}
