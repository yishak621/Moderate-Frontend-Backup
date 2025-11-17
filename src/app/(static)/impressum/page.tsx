import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Find Moderate Tech’s legal disclosure, registered business information, and contact details required for compliance.",
  keywords: [
    "Impressum",
    "legal disclosure",
    "company information",
    "Moderate Tech contact",
    "education software company",
  ],
  openGraph: {
    title: "Impressum | Moderate Tech",
    description:
      "Access the official legal disclosure and company information for Moderate Tech.",
    url: "/impressum",
  },
  alternates: {
    canonical: "/impressum",
  },
};

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impressum"
      description="Legal information and company details as required by law."
      termlyId="a70f6e64-4262-44ad-81e0-3c337ab79f93"
    />
  );
}
