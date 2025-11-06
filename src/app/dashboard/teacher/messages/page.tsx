import type { Metadata } from "next";
import { Suspense } from "react";
import MessagesClientTeachers from "./messagesClientTeachers";
import SuspenseLoading from "@/components/ui/SuspenseLoading";

export const metadata: Metadata = {
  title: "Messages",
  description:
    "View and manage your messages on Moderate Tech. Communicate with students and colleagues through the integrated messaging system.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <Suspense fallback={<SuspenseLoading fullscreen message="Loading messages, please wait..." />}>
      <MessagesClientTeachers />
    </Suspense>
  );
}
