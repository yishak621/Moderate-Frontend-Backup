import type { Metadata } from "next";
import FAQSection from "@/modules/static/home/sections/FAQSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about Moderate Tech’s teacher-first test moderation platform. Learn about features, pricing, setup, and support for assessment teams.",
  keywords: [
    "FAQ",
    "frequently asked questions",
    "test moderation FAQ",
    "assessment platform questions",
    "help center",
    "support",
  ],
  openGraph: {
    title: "FAQ | Moderate Tech",
    description:
      "Get answers about using Moderate Tech for collaborative test moderation and grading alignment.",
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
