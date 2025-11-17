import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the Terms and Conditions governing your access to and use of Moderate Tech’s education platform and services.",
  keywords: [
    "terms and conditions",
    "Moderate Tech terms",
    "education platform agreement",
    "service terms",
    "legal terms",
  ],
  openGraph: {
    title: "Terms and Conditions | Moderate Tech",
    description:
      "Review the contractual terms that apply when you use the Moderate Tech platform.",
    url: "/terms-and-conditions",
  },
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      description="Please read these terms and conditions carefully before using our service."
      termlyId="350fd2d1-84f1-4092-b37a-1630a380deb8"
    />
  );
}
