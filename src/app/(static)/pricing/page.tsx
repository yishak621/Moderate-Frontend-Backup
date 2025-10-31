import type { Metadata } from "next";
import PricingSection from "@/modules/static/home/sections/PricingSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Affordable pricing plans for schools and educational institutions. Choose from flexible monthly or yearly subscriptions with a 30-day free trial. No hidden fees, cancel anytime.",
  keywords: [
    "school management pricing",
    "education platform cost",
    "school software pricing",
    "subscription plans",
    "free trial",
    "education technology pricing",
  ],
  openGraph: {
    title: "Pricing | Moderate Tech",
    description:
      "Affordable pricing plans for schools with flexible monthly or yearly subscriptions and a 30-day free trial.",
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
