import type { Metadata } from "next";
import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/SuspenseLoading";
import AIAnalysisClient from "./aiAnalysisClient";

export const metadata: Metadata = {
  title: "AI Analysis",
  description:
    "Access AI-powered tools for grading, content detection, and similarity checking on Moderate Tech.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AIAnalysisPage() {
  return (
    <Suspense
      fallback={
        <SuspenseLoading
          fullscreen
          message="Loading AI Analysis tools, please wait..."
        />
      }
    >
      <AIAnalysisClient />
    </Suspense>
  );
}

