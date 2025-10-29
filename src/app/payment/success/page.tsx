"use client";

import PaymentStatusClient from "../PaymentStatusClient";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <PaymentStatusClient
      status="success"
      title="Payment Successful!"
      message="Your payment has been processed successfully. You now have full access to all premium features."
      icon={<CheckCircle2 className="w-20 h-20 text-green-600" />}
      primaryButtonText="Go to Dashboard"
      primaryButtonHref="/dashboard/teacher"
      secondaryButtonText="View Plans"
      secondaryButtonHref="/pricing"
    />
  );
}
