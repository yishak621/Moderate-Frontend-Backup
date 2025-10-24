"use client";

import LoadingFallback from "@/components/LoadingFallback";
import DomainVerification from "./domainVerifyClient";
import IllustrationGrid from "@/modules/auth/IllustrationGrid";
import { Suspense } from "react";

export default function DomainVerifyPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center bg-[#f1f1f1] min-h-screen">
      <IllustrationGrid />
      <Suspense fallback={<LoadingFallback />}>
        <DomainVerification />
      </Suspense>
    </div>
  );
}
