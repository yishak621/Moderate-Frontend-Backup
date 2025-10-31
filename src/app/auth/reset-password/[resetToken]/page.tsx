import type { Metadata } from "next";
import ResetPasswordForm from "@/modules/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Reset your Moderate Tech account password using the secure reset link. Create a new password to regain access to your account.",
  keywords: [
    "reset password",
    "password reset",
    "change password",
    "new password",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Reset Password | Moderate Tech",
    description:
      "Reset your Moderate Tech account password using the secure reset link.",
    url: "/auth/reset-password",
  },
  alternates: {
    canonical: "/auth/reset-password",
  },
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center">
      {/* Mobile/Tablet: Only show form */}
      <div className="w-full max-w-md  sm:px-6 lg:hidden">
        <ResetPasswordForm />
      </div>

      {/* Desktop: Show form with original layout */}
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:p-8">
        <div className="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
