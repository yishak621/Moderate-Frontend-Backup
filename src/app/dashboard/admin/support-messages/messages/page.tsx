import { Suspense } from "react";
import SupportAdminMessagesClient from "./supportAdminMessagesClient";
import Loading from "@/components/ui/Loading";

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
