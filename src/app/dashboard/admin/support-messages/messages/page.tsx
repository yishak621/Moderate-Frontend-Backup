import type { Metadata } from "next";
import { Suspense } from "react";
import SupportAdminMessagesClient from "./supportAdminMessagesClient";
import Loading from "@/components/ui/Loading";

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
    <Suspense
      fallback={
        <div className="h-screen w-screen">
          <Loading text="Loading Support Messages..." className="h-full" />
        </div>
      }
    >
      <SupportAdminMessagesClient />
    </Suspense>
  );
}
