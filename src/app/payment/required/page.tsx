import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentRequiredClient from "./PaymentRequiredClient";
import SuspenseLoading from "@/components/ui/SuspenseLoading";

export const metadata: Metadata = {
  title: "Payment Required",
  description:
    "Your Moderate Tech subscription needs attention. Update your billing details to continue accessing premium grading and moderation tools.",
  keywords: [
    "payment required",
    "billing issue",
    "subscription update",
    "Moderate Tech billing",
  ],
  openGraph: {
    title: "Payment Required | Moderate Tech",
    description:
      "Resolve your billing issue to regain full access to the Moderate Tech platform.",
    url: "/payment/required",
  },
  alternates: {
    canonical: "/payment/required",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentRequiredPage() {
  return (
    <Suspense fallback={<SuspenseLoading fullscreen message="Loading..." />}>
      <PaymentRequiredClient />
    </Suspense>
  );
}
