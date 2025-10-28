"use client";

import ResetPasswordForm from "@/modules/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center">
      {/* Mobile/Tablet: Only show form */}
      <div className="w-full max-w-md px-4 sm:px-6 lg:hidden">
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
