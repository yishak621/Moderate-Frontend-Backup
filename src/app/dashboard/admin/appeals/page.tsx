import type { Metadata } from "next";
import AppealsClient from "./appealsClient";

export const metadata: Metadata = {
  title: "Appeals Management",
  description:
    "Manage user appeals on Moderate Tech. Review and process appeals from suspended or banned users.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
      <AppealsClient />
    </>
  );
}

