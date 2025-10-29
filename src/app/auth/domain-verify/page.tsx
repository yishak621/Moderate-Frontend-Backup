"use client";

import LoadingFallback from "@/components/LoadingFallback";
import DomainVerification from "./domainVerifyClient";
import IllustrationGrid from "@/modules/auth/IllustrationGrid";
import { Suspense } from "react";

export default function DomainVerifyPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Mobile/Tablet: Only show form */}
      <div className="w-full max-w-md lg:hidden">
        <Suspense fallback={<LoadingFallback />}>
          <DomainVerification />
        </Suspense>
      </div>

      {/* Desktop: Split layout with IllustrationGrid */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12 w-full max-w-7xl h-screen items-center">
        <IllustrationGrid />
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <Suspense fallback={<LoadingFallback />}>
              <DomainVerification />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
