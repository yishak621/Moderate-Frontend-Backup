"use client";

import LoadingFallback from "@/components/LoadingFallback";
import DomainVerification from "./domainVerifyClient";
import { Suspense } from "react";

export default function DomainVerifyPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
        <Suspense fallback={<LoadingFallback />}>
          <DomainVerification />
        </Suspense>
      </div>
    </div>
  );
}
