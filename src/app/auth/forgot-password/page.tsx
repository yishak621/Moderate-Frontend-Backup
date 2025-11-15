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
    <div className="min-h-screen lg:h-screen bg-[#f1f1f1] flex items-center justify-center  sm:p-6 lg:p-8">
      {/* Mobile/Tablet: Only show form - Full screen */}
      <div className="w-full min-h-screen lg:hidden flex flex-col items-center justify-start overflow-y-auto">
        {/* Mobile Header (brand) */}
        <div className="w-full max-w-md px-6 pt-8 mb-[52px]">
          <div className="flex flex-col items-center text-center gap-2">
            <img
              src="/images/logo/logo-4.png"
              alt="Moderate Logo"
              width={44}
              height={44}
            />
            <h2 className="text-2xl font-semibold">Forgot Password?</h2>
            <p className="text-gray-600 text-sm">
              No worries, we&apos;ll send you reset instructions
            </p>
          </div>
        </div>
        <div className="w-full max-w-md pb-10 px-2">
          <ForgotPasswordForm showHeader={false} />
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
