import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description:
    "Understand the guidelines for acceptable use of Moderate Tech’s platform, including restrictions on misuse, abuse, and prohibited activities.",
  keywords: [
    "acceptable use policy",
    "platform usage rules",
    "Moderate Tech policy",
    "legal terms",
    "user responsibilities",
  ],
  openGraph: {
    title: "Acceptable Use Policy | Moderate Tech",
    description:
      "Review the acceptable use policy governing how educators and institutions can use Moderate Tech’s platform.",
    url: "/acceptable-use",
  },
  alternates: {
    canonical: "/acceptable-use",
  },
};

export default function AcceptableUsePage() {
  return (
    <LegalPage
      title="Acceptable Use Policy"
      description="This policy outlines the acceptable use of our platform and services."
      termlyId="0281bec9-72a2-47c7-a3d8-de4d52d31a14"
    />
  );
}
