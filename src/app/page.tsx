import type { Metadata } from "next";
import HeroSection from "@/modules/static/home/sections/HeroSection";
import ServicesSection from "@/modules/static/home/sections/ServicesSection";
import BenefitsSection from "@/modules/static/home/sections/BenefitsSection";
import HowItWorksSection from "@/modules/static/home/sections/HowItWorksSection";
import PricingSection from "@/modules/static/home/sections/PricingSection";
import TestimonialsSection from "@/modules/static/home/sections/TestimonialsSection";
import FAQSection from "@/modules/static/home/sections/FAQSection";
import CTASection from "@/modules/static/home/sections/CTASection";
import StaticLayout from "@/modules/static/layout/StaticLayout";
import MotoSection from "@/modules/static/home/sections/MotoSection";
import CTAMidSection from "@/modules/static/home/sections/CTAMidSection";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Modern school management platform for educational institutions. Manage students, teachers, grading, announcements, and more with our comprehensive education technology solution.",
  keywords: [
    "school management software",
    "education platform",
    "student management system",
    "teacher dashboard",
    "grading platform",
    "school administration software",
  ],
  openGraph: {
    title: "Moderate Tech - Modern School Management Platform",
    description:
      "Modern school management platform for educational institutions. Manage students, teachers, grading, and more.",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <StaticLayout>
      <HeroSection />
      <MotoSection />
      <ServicesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <CTAMidSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
    </StaticLayout>
  );
}
