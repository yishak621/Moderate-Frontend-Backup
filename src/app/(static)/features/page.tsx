import type { Metadata } from "next";
import ServicesSection from "@/modules/static/home/sections/ServicesSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Discover comprehensive features of Moderate Tech school management platform. Student management, teacher dashboard, grading system, announcements, messaging, and more.",
  keywords: [
    "school management features",
    "education platform features",
    "student management tools",
    "teacher dashboard features",
    "grading system",
    "school administration features",
  ],
  openGraph: {
    title: "Features | Moderate Tech",
    description:
      "Discover comprehensive features of Moderate Tech school management platform for educational institutions.",
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
