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
