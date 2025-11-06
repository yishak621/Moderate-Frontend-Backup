import type { Metadata } from "next";
import DomainVerification from "./domainVerifyClient";
import IllustrationGrid from "@/modules/auth/IllustrationGrid";
import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/SuspenseLoading";

export const metadata: Metadata = {
  title: "Domain Verification",
  description:
    "Verify your school domain email address to complete registration and access your Moderate Tech school management account.",
  keywords: [
    "domain verification",
    "email domain verification",
    "school domain",
    "domain verify",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Domain Verification | Moderate Tech",
    description:
      "Verify your school domain email address to complete registration.",
    url: "/auth/domain-verify",
  },
  alternates: {
    canonical: "/auth/domain-verify",
  },
};

export default function DomainVerifyPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Mobile/Tablet: Only show form */}
      <div className="w-full max-w-md lg:hidden">
        <Suspense fallback={<SuspenseLoading fullscreen message="Loading..." />}>
          <DomainVerification />
        </Suspense>
      </div>

      {/* Desktop: Split layout with IllustrationGrid */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12 w-full max-w-7xl h-screen items-center">
        <IllustrationGrid />
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <Suspense fallback={<SuspenseLoading fullscreen message="Loading..." />}>
              <DomainVerification />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
