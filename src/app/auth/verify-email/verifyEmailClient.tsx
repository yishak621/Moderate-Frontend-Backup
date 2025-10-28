"use client";

import Button from "@/components/ui/Button";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailClient() {
  return (
    <div className="w-full bg-[#fdfdfd] rounded-[20px] sm:rounded-[24px] shadow-lg border border-gray-100 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 text-center">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
        Verify Your Email
      </h1>
      <p className="text-base font-normal text-gray-600 mb-6 sm:text-base">
        We&apos;ve sent a verification link to your email address. Please check
        your inbox and click the link to continue.
      </p>

      {/* Action */}
      <Button className="w-full mb-3">Resend Verification Email</Button>

      {/* Secondary link */}
      <p className="text-sm text-gray-500">
        Didn&apos;t get the email?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Try a different email
        </Link>
      </p>
    </div>
  );
}
