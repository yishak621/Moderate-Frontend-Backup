import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Read the legal disclaimer for Moderate Tech outlining limitations of liability, warranties, and use of information provided on the platform.",
  keywords: [
    "disclaimer",
    "legal notice",
    "Moderate Tech disclaimer",
    "liability statement",
    "education platform notice",
  ],
  openGraph: {
    title: "Disclaimer | Moderate Tech",
    description:
      "Understand the legal disclaimer that governs your use of the Moderate Tech website and services.",
    url: "/disclaimer",
  },
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="Please read our disclaimer regarding the use of our platform and services."
      termlyId="61309883-fb71-4f7c-90c8-e78cbc4b319f"
    />
  );
}
