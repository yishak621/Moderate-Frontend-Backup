import BenefitsSection from "@/modules/static/home/sections/BenefitsSection";
import MotoSection from "@/modules/static/home/sections/MotoSection";
import StaticLayout from "@/modules/static/layout/StaticLayout";
import PageHeader from "@/modules/static/layout/PageHeader";

export default function AboutPage() {
  return (
    <StaticLayout>
      <div className="py-20 w-full">
        <PageHeader title="About Us" />
        <MotoSection align="center" />
        <BenefitsSection />
      </div>
    </StaticLayout>
  );
}
