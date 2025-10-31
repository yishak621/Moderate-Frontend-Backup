import type { Metadata } from "next";
import GradingClientTeachers from "./gradingClientTeachers";

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
    <>
      <GradingClientTeachers />
    </>
  );
}
