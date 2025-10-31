import type { Metadata } from "next";
import SupportClient from "./supportClient";

export const metadata: Metadata = {
  title: "Support Messages",
  description:
    "Manage support messages on Moderate Tech. View and respond to support requests from teachers and users.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
      <SupportClient />
    </>
  );
}
