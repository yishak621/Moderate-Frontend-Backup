import type { Metadata } from "next";
import ForgotPasswordForm from "@/modules/auth/ForgotPassword";
import LoginScreen from "@/modules/auth/LoginScreen";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your Moderate Tech account password. Enter your email address to receive password reset instructions.",
  keywords: [
    "forgot password",
    "reset password",
    "password recovery",
    "account recovery",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Forgot Password | Moderate Tech",
    description:
      "Reset your Moderate Tech account password. Enter your email to receive reset instructions.",
    url: "/auth/forgot-password",
  },
  alternates: {
    canonical: "/auth/forgot-password",
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="h-screen bg-[#f1f1f1] flex items-center justify-center  sm:p-6 lg:p-8">
      {/* Mobile/Tablet: Only show form - Full screen */}
      <div className="w-full h-screen lg:hidden flex items-center justify-center">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>

      {/* Desktop: Split layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12 w-full max-w-7xl h-screen items-center">
        <LoginScreen />
        <div className="h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="w-full max-h-screen overflow-y-auto scrollbar-hide">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
