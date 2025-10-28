"use client";

import ServicesSection from "@/modules/static/home/sections/ServicesSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export default function FeaturesPage() {
  return (
    <div className="py-20 w-full">
      <PageHeader title="Features" pathname="/features" />
      <ServicesSection />
    </div>
  );
}
