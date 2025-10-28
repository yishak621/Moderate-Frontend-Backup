"use client";

import LoginScreen from "@/modules/auth/LoginScreen";
import RegisterForm from "@/modules/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Mobile/Tablet: Only show form */}
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
        <RegisterForm />
      </div>

      {/* Desktop: Show both login screen and form */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12 w-full max-w-7xl items-center">
        <LoginScreen />
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
