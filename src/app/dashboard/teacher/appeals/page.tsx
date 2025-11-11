import type { Metadata } from "next";
import AppealsClient from "./appealsClient";

export const metadata: Metadata = {
  title: "Appeals",
  description: "Submit an appeal if you believe your account moderation was incorrect.",
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

