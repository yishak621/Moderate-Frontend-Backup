"use client";

import LoginForm from "@/modules/auth/LoginForm";
import LoginScreen from "@/modules/auth/LoginScreen";

export default function LoginPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center bg-[#f1f1f1] h-screen">
      <LoginScreen />

      <LoginForm />
    </div>
  );
}
