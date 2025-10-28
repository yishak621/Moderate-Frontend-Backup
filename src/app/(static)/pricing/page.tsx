"use client";

import PricingSection from "@/modules/static/home/sections/PricingSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export default function PricingPage() {
  return (
    <div className="py-20 w-full">
      <PageHeader title="Pricing" pathname="/pricing" />
      <PricingSection />
    </div>
  );
}
