import type { Metadata } from "next";
import BenefitsSection from "@/modules/static/home/sections/BenefitsSection";
import MotoSection from "@/modules/static/home/sections/MotoSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Moderate Tech, our mission to modernize test moderation, and how we help educators standardize grading quality across every level of education.",
  keywords: [
    "about Moderate Tech",
    "test moderation company",
    "education technology",
    "assessment software",
    "teacher platform",
  ],
  openGraph: {
    title: "About Us | Moderate Tech",
    description:
      "Discover how Moderate Tech empowers teachers with collaborative test moderation tools.",
    url: "/about",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="py-20 w-full">
      <PageHeader title="About Us" pathname="/about" />
      <MotoSection align="center" />
      <BenefitsSection />
    </div>
  );
}
