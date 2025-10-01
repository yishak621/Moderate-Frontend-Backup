"use client";

import Button from "@/components/ui/Button";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailClient() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Verify Your Email
        </h1>
        <p className="text-gray-600 mb-6">
          We’ve sent a verification link to your email address. Please check
          your inbox and click the link to continue.
        </p>

        {/* Action */}
        <Button className="w-full mb-3">Resend Verification Email</Button>

        {/* Secondary link */}
        <p className="text-sm text-gray-500">
          Didn’t get the email?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Try a different email
          </Link>
        </p>
      </div>
    </div>
  );
}
