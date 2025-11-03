import type { Metadata } from "next";
import SubjectsClient from "./subjectsClient";

export const metadata: Metadata = {
  title: "Subject Curricular Areas",
  description:
    "Manage subject curricular areas on Moderate Tech. Add, edit, and organize academic subjects and categories.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
      <SubjectsClient />
    </>
  );
}
