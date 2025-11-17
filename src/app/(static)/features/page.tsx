import type { Metadata } from "next";
import ServicesSection from "@/modules/static/home/sections/ServicesSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore the features of Moderate Tech’s test moderation platform: rubric-driven grading, collaborative reviews, audit-ready records, and messaging built for teachers.",
  keywords: [
    "test moderation features",
    "assessment review tools",
    "teacher collaboration features",
    "grading system",
    "moderation workflow",
    "education quality assurance",
  ],
  openGraph: {
    title: "Features | Moderate Tech",
    description:
      "See how Moderate Tech equips teachers with collaborative test moderation and grading features.",
    url: "/features",
  },
  alternates: {
    canonical: "/features",
  },
};

export default function FeaturesPage() {
  return (
    <div className="py-20 w-full">
      <PageHeader title="Features" pathname="/features" />
      <ServicesSection />
    </div>
  );
}
