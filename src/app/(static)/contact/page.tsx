"use client";

import ContactUsSection from "@/modules/static/contact/contactUsSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export default function ContactPage() {
  return (
    <div className="py-20 w-full">
      <PageHeader title="Get in touch" pathname="/contact" />
      <ContactUsSection />
    </div>
  );
}
