"use client";

import LoginScreen from "@/modules/auth/LoginScreen";
import LoginForm from "@/modules/auth/LoginForm";
export default function LoginPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center bg-[#f1f1f1] h-screen">
      <LoginScreen />

      <LoginForm />
    </div>
  );
}
