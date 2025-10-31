import type { Metadata } from "next";
import GuideClient from "./guideClient";

export const metadata: Metadata = {
  title: "Guide",
  description:
    "Access user guides and tutorials for Moderate Tech. Learn how to use platform features, grading tools, and more.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <>
      <GuideClient />
    </>
  );
}
