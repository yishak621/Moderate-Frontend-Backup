import type { Metadata } from "next";
import StaticLayout from "@/modules/static/layout/StaticLayout";
import PageHeader from "@/modules/static/layout/PageHeader";
import ServicesSection from "@/modules/static/home/sections/ServicesSection";
import PricingSection from "@/modules/static/home/sections/PricingSection";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read Moderate Tech's Privacy Policy to understand how we collect, use, and protect your personal information and data when using our school management platform.",
  keywords: [
    "privacy policy",
    "data protection",
    "privacy",
    "GDPR",
    "data security",
    "school data privacy",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | Moderate Tech",
    description:
      "Read Moderate Tech's Privacy Policy to understand how we protect your data.",
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
