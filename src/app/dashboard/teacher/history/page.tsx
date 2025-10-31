import type { Metadata } from "next";
import HistoryClientTeachers from "./historyClientTeachers";

export const metadata: Metadata = {
  title: "History",
  description:
    "View your activity history on Moderate Tech. Track your past actions, grading history, and account activity.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <>
      <HistoryClientTeachers />
    </>
  );
}
