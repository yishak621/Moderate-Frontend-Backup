import type { Metadata } from "next";
import PricingSection from "@/modules/static/home/sections/PricingSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for teacher-led test moderation teams. Choose flexible plans that scale across departments or institutions with a 30-day free trial.",
  keywords: [
    "test moderation pricing",
    "assessment platform cost",
    "teacher software pricing",
    "subscription plans",
    "free trial",
    "education technology pricing",
  ],
  openGraph: {
    title: "Pricing | Moderate Tech",
    description:
      "Review Moderate Tech pricing for collaborative test moderation workflows across any institution.",
    url: "/pricing",
  },
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="py-20 w-full">
      <PageHeader title="Pricing" pathname="/pricing" />
      <PricingSection />
    </div>
  );
}
