"use client";

import LoginScreen from "@/modules/auth/LoginScreen";
import RegisterForm from "@/modules/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center bg-[#f1f1f1] h-screen">
      <LoginScreen />
      <RegisterForm />
    </div>
  );
}
