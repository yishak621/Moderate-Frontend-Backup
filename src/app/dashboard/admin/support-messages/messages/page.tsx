import type { Metadata } from "next";
import { Suspense } from "react";
import SupportAdminMessagesClient from "./supportAdminMessagesClient";
import SuspenseLoading from "@/components/ui/SuspenseLoading";

export const metadata: Metadata = {
  title: "Support Messages",
  description:
    "View and manage individual support messages on Moderate Tech. Respond to support requests and track conversations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <Suspense fallback={<SuspenseLoading fullscreen message="Loading Support Messages..." />}>
      <SupportAdminMessagesClient />
    </Suspense>
  );
}
