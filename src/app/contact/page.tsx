import StaticLayout from "@/modules/static/layout/StaticLayout";
import PageHeader from "@/modules/static/layout/PageHeader";
import ContactUsSection from "@/modules/static/contact/contactUsSection";

export default function ContactPage() {
  return (
    <StaticLayout>
      <div className="py-20 w-full">
        <PageHeader title="Get in touch" />
        <ContactUsSection />
      </div>
    </StaticLayout>
  );
}
