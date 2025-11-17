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
    "Modern test moderation platform for educators at any institutional level. Align grading, capture evidence, and collaborate on assessment reviews with streamlined tools designed for teachers.",
  keywords: [
    "test moderation platform",
    "assessment moderation",
    "teacher grading workflow",
    "exam review software",
    "grading collaboration",
    "education assessment quality",
  ],
  openGraph: {
    title: "Moderate Tech - Modern Test Moderation Platform",
    description:
      "Purpose-built software for teachers to moderate tests, align grading standards, and collaborate across institutions.",
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
