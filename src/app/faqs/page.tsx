import StaticLayout from "@/modules/static/layout/StaticLayout";
import PageHeader from "@/modules/static/layout/PageHeader";
import FAQSection from "@/modules/static/home/sections/FAQSection";

export default function FAQsPage() {
  return (
    <StaticLayout>
      <div className="py-20 w-full">
        <PageHeader title="FAQ" />
        <FAQSection />
      </div>
    </StaticLayout>
  );
}
