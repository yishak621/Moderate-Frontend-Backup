import type { Metadata } from "next";
import PaymentStatusClient from "../PaymentStatusClient";
import { XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Failed",
  description:
    "Your payment could not be processed. Please check your payment details and try again, or contact support for assistance.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Payment Failed | Moderate Tech",
    description:
      "Your payment could not be processed. Please try again or contact support.",
    url: "/payment/failed",
  },
  alternates: {
    canonical: "/payment/failed",
  },
};

export default function PaymentFailedPage() {
  return (
    <PaymentStatusClient
      status="failed"
      title="Payment Failed"
      message="Unfortunately, your payment could not be processed. Please check your payment details and try again."
      icon={<XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-600" />}
      primaryButtonText="Try Again"
      primaryButtonHref="/pricing"
      secondaryButtonText="Contact Support"
      secondaryButtonHref="/contact"
    />
  );
}
