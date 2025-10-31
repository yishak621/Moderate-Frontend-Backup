import type { Metadata } from "next";
import BenefitsSection from "@/modules/static/home/sections/BenefitsSection";
import MotoSection from "@/modules/static/home/sections/MotoSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Moderate Tech, our mission to revolutionize school management, and how we help educational institutions streamline their operations with cutting-edge technology.",
  keywords: [
    "about Moderate Tech",
    "school management company",
    "education technology",
    "school software",
    "educational platform",
  ],
  openGraph: {
    title: "About Us | Moderate Tech",
    description:
      "Learn about Moderate Tech and our mission to revolutionize school management.",
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
