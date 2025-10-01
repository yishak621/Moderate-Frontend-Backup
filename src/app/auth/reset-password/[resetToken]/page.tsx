"use client";

import LoginScreen from "@/modules/auth/LoginScreen";
import ResetPasswordForm from "@/modules/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="grid   items-center justify-center bg-[#f1f1f1] h-screen">
      <ResetPasswordForm />
    </div>
  );
}
