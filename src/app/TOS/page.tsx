import StaticLayout from "@/modules/static/layout/StaticLayout";
import PageHeader from "@/modules/static/layout/PageHeader";
import ServicesSection from "@/modules/static/home/sections/ServicesSection";
import PricingSection from "@/modules/static/home/sections/PricingSection";

export default function TOSPage() {
  return (
    <StaticLayout>
      <div className="py-20 w-full">
        <PageHeader title="Terms of Service" />
        {/* <TermsOfServiceSection /> */}
      </div>
    </StaticLayout>
  );
}
