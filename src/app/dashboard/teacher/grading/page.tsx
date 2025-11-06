import type { Metadata } from "next";
import { Suspense } from "react";
import GradingClientTeachers from "./gradingClientTeachers";
import SuspenseLoading from "@/components/ui/SuspenseLoading";

export const metadata: Metadata = {
  title: "Grading Feeds",
  description:
    "Access and manage student grading feeds on Moderate Tech. Review and grade student work efficiently.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <Suspense
      fallback={
        <SuspenseLoading
          fullscreen
          message="Loading grading feeds, please wait..."
        />
      }
    >
      <GradingClientTeachers />
    </Suspense>
  );
}
