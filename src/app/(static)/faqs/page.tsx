import type { Metadata } from "next";
import FAQSection from "@/modules/static/home/sections/FAQSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about Moderate Tech school management platform. Learn about features, pricing, setup, support, and how our platform can help your educational institution.",
  keywords: [
    "FAQ",
    "frequently asked questions",
    "school management FAQ",
    "education platform questions",
    "help center",
    "support",
  ],
  openGraph: {
    title: "FAQ | Moderate Tech",
    description:
      "Find answers to common questions about Moderate Tech school management platform.",
    url: "/faqs",
  },
  alternates: {
    canonical: "/faqs",
  },
};

export default function FAQsPage() {
  return (
    <div className="py-20 w-full">
      <PageHeader title="FAQ" pathname="/faqs" />
      <FAQSection />
    </div>
  );
}
