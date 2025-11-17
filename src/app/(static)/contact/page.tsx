import type { Metadata } from "next";
import ContactUsSection from "@/modules/static/contact/contactUsSection";
import PageHeader from "@/modules/static/layout/PageHeader";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Moderate Tech. Contact our team with questions about the test moderation platform, pricing, features, or to schedule a teacher-focused demo.",
  keywords: [
    "contact Moderate Tech",
    "test moderation support",
    "contact us",
    "customer support",
    "help desk",
    "assessment platform support",
  ],
  openGraph: {
    title: "Contact Us | Moderate Tech",
    description:
      "Reach out to learn how Moderate Tech can power your institution’s test moderation and grading workflows.",
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
