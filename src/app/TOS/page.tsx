import type { Metadata } from "next";
import StaticLayout from "@/modules/static/layout/StaticLayout";
import PageHeader from "@/modules/static/layout/PageHeader";
import ServicesSection from "@/modules/static/home/sections/ServicesSection";
import PricingSection from "@/modules/static/home/sections/PricingSection";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read Moderate Tech's Terms of Service to understand the rules and guidelines for using our school management platform and services.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "user agreement",
    "service terms",
    "legal terms",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service | Moderate Tech",
    description:
      "Read Moderate Tech's Terms of Service to understand the rules for using our platform.",
    url: "/TOS",
  },
  alternates: {
    canonical: "/TOS",
  },
};

export default function TOSPage() {
  return (
    <StaticLayout>
      <div className="py-20 w-full">
        <PageHeader title="Terms of Service" />
        {/* <TermsOfServiceSection /> */}
      </div>
    </StaticLayout>
  );
}
