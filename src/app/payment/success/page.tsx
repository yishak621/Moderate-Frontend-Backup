import type { Metadata } from "next";
import PaymentStatusClient from "../PaymentStatusClient";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful",
  description:
    "Your payment has been processed successfully. You now have full access to all Moderate Tech premium features.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Payment Successful | Moderate Tech",
    description: "Your payment has been processed successfully.",
    url: "/payment/success",
  },
  alternates: {
    canonical: "/payment/success",
  },
};

export default function PaymentSuccessPage() {
  return (
    <PaymentStatusClient
      status="success"
      title="Payment Successful!"
      message="Your payment has been processed successfully. You now have full access to all premium features."
      icon={
        <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-600" />
      }
      primaryButtonText="Dashboard"
      primaryButtonHref="/dashboard/teacher"
      secondaryButtonText="View Plans"
      secondaryButtonHref="/pricing"
    />
  );
}
