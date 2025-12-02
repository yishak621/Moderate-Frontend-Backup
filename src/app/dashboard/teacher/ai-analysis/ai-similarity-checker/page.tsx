import type { Metadata } from "next";
import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/SuspenseLoading";
import AISimilarityCheckerClient from "./aiSimilarityCheckerClient";

export const metadata: Metadata = {
  title: "AI Similarity Checker",
  description:
    "Check for similarity and plagiarism across student submissions on Moderate Tech.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AISimilarityCheckerPage() {
  return (
    <Suspense
      fallback={
        <SuspenseLoading
          fullscreen
          message="Loading AI Similarity Checker, please wait..."
        />
      }
    >
      <AISimilarityCheckerClient />
    </Suspense>
  );
}

