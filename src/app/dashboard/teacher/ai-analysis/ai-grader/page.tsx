import type { Metadata } from "next";
import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/SuspenseLoading";
import AIGraderClient from "./aiGraderClient";

export const metadata: Metadata = {
  title: "AI Grader",
  description:
    "Automatically grade student submissions using AI-powered analysis on Moderate Tech.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AIGraderPage() {
  return (
    <Suspense
      fallback={
        <SuspenseLoading
          fullscreen
          message="Loading AI Grader, please wait..."
        />
      }
    >
      <AIGraderClient />
    </Suspense>
  );
}

