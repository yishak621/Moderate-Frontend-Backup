"use client";

import ForgotPasswordForm from "@/modules/auth/ForgotPassword";
import LoginScreen from "@/modules/auth/LoginScreen";

export default function ForgotPasswordPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center bg-[#f1f1f1] h-screen">
      <LoginScreen />
      <ForgotPasswordForm />
    </div>
  );
}
