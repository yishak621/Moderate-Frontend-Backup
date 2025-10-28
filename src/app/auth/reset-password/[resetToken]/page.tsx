"use client";

import ResetPasswordForm from "@/modules/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
