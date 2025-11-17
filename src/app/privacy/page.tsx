import type { Metadata } from "next";
import StaticLayout from "@/modules/static/layout/StaticLayout";
import PageHeader from "@/modules/static/layout/PageHeader";
import ServicesSection from "@/modules/static/home/sections/ServicesSection";
import PricingSection from "@/modules/static/home/sections/PricingSection";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read Moderate Tech's Privacy Policy to learn how we collect, use, and protect educator data when you use our test moderation platform.",
  keywords: [
    "privacy policy",
    "data protection",
    "privacy",
    "GDPR",
    "data security",
    "assessment data privacy",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | Moderate Tech",
    description:
      "Learn how Moderate Tech protects educator and assessment data across our test moderation tools.",
    url: "/privacy",
  },
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <StaticLayout>
      <div className="py-20 w-full">
        <PageHeader title="Privacy Policy" />
        {/* <PrivacyPolicySection /> */}
      </div>
    </StaticLayout>
  );
}
