"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function ForgotPasswordForm() {
  return (
    <div className="bg-[#fdfdfd] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 rounded-[24px] w-full max-w-lg mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 pb-6 sm:pb-4 lg:pb-10">
        <h2 className="text-2xl font-semibold text-dark">Moderate</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Teacher Portal System
        </p>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-5 sm:gap-6">
        <Input label="Email" type="email" placeholder="you@example.com" />
      </div>

      {/* Button */}
      <Button className="justify-center mt-2.5 sm:mt-4 text-base cursor-pointer w-full">
        Reset Password
      </Button>

      <div className="text-center text-sm sm:text-base mt-1">
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
