import type { Metadata } from "next";
import { Suspense } from "react";
import MessagesAnnouncementsClient from "./messagesAnnouncementsClient";
import SuspenseLoading from "@/components/ui/SuspenseLoading";

export const metadata: Metadata = {
  title: "Messages & Announcements",
  description:
    "View and manage your messages and announcements on Moderate Tech.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <Suspense fallback={<SuspenseLoading fullscreen message="Loading, please wait..." />}>
      <MessagesAnnouncementsClient />
    </Suspense>
  );
}

