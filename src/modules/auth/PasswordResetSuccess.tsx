"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PasswordResetSuccess() {
  const router = useRouter();

  // optional auto redirect after 5s
  useEffect(() => {
    const timer = setTimeout(() => router.push("/auth/login"), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
        <CheckCircle2 className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Password Reset Successful
        </h2>
        <p className="text-gray-600 mt-2">
          Your password has been securely updated. You can now log in with your
          new password.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Go to Login
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Back to Home
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Redirecting to login in 5 seconds...
        </p>
      </div>
    </div>
  );
}
