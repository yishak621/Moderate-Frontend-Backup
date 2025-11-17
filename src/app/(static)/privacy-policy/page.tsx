import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Moderate Tech collects, uses, stores, and protects educator and institutional data across our test moderation platform.",
  keywords: [
    "privacy policy",
    "data protection",
    "Moderate Tech privacy",
    "assessment data security",
    "education compliance",
  ],
  openGraph: {
    title: "Privacy Policy | Moderate Tech",
    description:
      "Review Moderate Tech’s privacy practices, including how we handle personal information and comply with regulations.",
    url: "/privacy-policy",
  },
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Our Privacy Policy explains how we collect, use, and protect your personal information."
      termlyId="f86c5a30-015d-4eb7-ab2a-a0d109fce08d"
    />
  );
}
