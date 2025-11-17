import type { Metadata } from "next";
import VerifyEmailClient from "./verifyEmailClient";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Verify your email address to complete your Moderate Tech account setup and unlock teacher-focused test moderation tools.",
  keywords: [
    "email verification",
    "verify email",
    "confirm email",
    "account activation",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Verify Email | Moderate Tech",
    description:
      "Confirm your email to start collaborating on test moderation and grading alignment.",
    url: "/auth/verify-email",
  },
  alternates: {
    canonical: "/auth/verify-email",
  },
};

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center">
      {/* Mobile/Tablet: Only show form */}
      <div className="w-full max-w-md  sm:px-6 lg:hidden">
        <VerifyEmailClient />
      </div>

      {/* Desktop: Show form with original layout */}
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:p-8">
        <div className="w-full max-w-md">
          <VerifyEmailClient />
        </div>
      </div>
    </div>
  );
}
