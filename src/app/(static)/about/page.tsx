"use client";

import BenefitsSection from "@/modules/static/home/sections/BenefitsSection";
import MotoSection from "@/modules/static/home/sections/MotoSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export default function AboutPage() {
  return (
    <div className="py-20 w-full">
      <PageHeader title="About Us" pathname="/about" />
      <MotoSection align="center" />
      <BenefitsSection />
    </div>
  );
}
