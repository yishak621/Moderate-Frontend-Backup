import type { Metadata } from "next";
import ContactUsSection from "@/modules/static/contact/contactUsSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Moderate Tech. Contact our support team for questions about our school management platform, pricing, features, or to schedule a demo.",
  keywords: [
    "contact Moderate Tech",
    "school management support",
    "contact us",
    "customer support",
    "help desk",
    "education platform support",
  ],
  openGraph: {
    title: "Contact Us | Moderate Tech",
    description:
      "Get in touch with Moderate Tech for questions about our school management platform or to schedule a demo.",
    url: "/contact",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="py-20 w-full">
      <PageHeader title="Get in touch" pathname="/contact" />
      <ContactUsSection />
    </div>
  );
}
