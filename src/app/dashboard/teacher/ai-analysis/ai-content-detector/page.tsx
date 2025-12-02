import type { Metadata } from "next";
import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/SuspenseLoading";
import AIContentDetectorClient from "./aiContentDetectorClient";

export const metadata: Metadata = {
  title: "AI Content Detector",
  description:
    "Detect AI-generated content in student submissions on Moderate Tech.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AIContentDetectorPage() {
  return (
    <Suspense
      fallback={
        <SuspenseLoading
          fullscreen
          message="Loading AI Content Detector, please wait..."
        />
      }
    >
      <AIContentDetectorClient />
    </Suspense>
  );
}

