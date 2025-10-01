"use client";

import { CheckCircle2 } from "lucide-react";

export default function PasswordResetSent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle2 className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Password Reset Link Sent
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Please check your email inbox and follow the instructions to reset
          your password.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
            Open Email App
          </button>
          <button className="w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            Back to Login
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Didn’t receive the email?{" "}
          <button className="text-blue-600 hover:underline">Resend</button>
        </p>
      </div>
    </div>
  );
}
