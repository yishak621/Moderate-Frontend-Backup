import type { Metadata } from "next";
import CurricularClient from "./curricularClient";

export const metadata: Metadata = {
  title: "Curricular Area Management",
  description:
    "Manage curricular areas on Moderate Tech. Add, edit, and organize subject areas and curriculum structures.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
      <CurricularClient />
    </>
  );
}
