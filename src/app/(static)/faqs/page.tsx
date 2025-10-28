"use client";

import FAQSection from "@/modules/static/home/sections/FAQSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export default function FAQsPage() {
  return (
    <div className="py-20 w-full">
      <PageHeader title="FAQ" pathname="/faqs" />
      <FAQSection />
    </div>
  );
}
