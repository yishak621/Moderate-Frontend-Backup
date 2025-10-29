"use client";

import PaymentStatusClient from "../PaymentStatusClient";
import { XCircle } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <PaymentStatusClient
      status="failed"
      title="Payment Failed"
      message="Unfortunately, your payment could not be processed. Please check your payment details and try again."
      icon={<XCircle className="w-20 h-20 text-red-600" />}
      primaryButtonText="Try Again"
      primaryButtonHref="/pricing"
      secondaryButtonText="Contact Support"
      secondaryButtonHref="/contact"
    />
  );
}
