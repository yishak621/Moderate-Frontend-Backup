import { Suspense } from "react";
import PaymentRequiredClient from "./PaymentRequiredClient";
import SuspenseLoading from "@/components/ui/SuspenseLoading";

export default function PaymentRequiredPage() {
  return (
    <Suspense fallback={<SuspenseLoading fullscreen message="Loading..." />}>
      <PaymentRequiredClient />
    </Suspense>
  );
}
