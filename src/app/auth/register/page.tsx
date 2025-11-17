import type { Metadata } from "next";
import LoginScreen from "@/modules/auth/LoginScreen";
import RegisterForm from "@/modules/auth/RegisterForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your Moderate Tech account. Join educators using our dedicated test moderation platform to standardize grading across any institution.",
  keywords: [
    "register",
    "sign up",
    "create account",
    "test moderation signup",
    "teacher registration",
    "assessment platform signup",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Register | Moderate Tech",
    description:
      "Sign up for Moderate Tech and start collaborating with teachers on test moderation and grading alignment.",
    url: "/auth/register",
  },
  alternates: {
    canonical: "/auth/register",
  },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen sm:h-screen lg:h-screen bg-[#f1f1f1] flex items-center justify-center  sm:p-6 lg:p-8">
      {/* Mobile/Tablet: Only show form - Full screen */}
      <div className="mt-15 sm:mt-0 w-full min-h-screen lg:hidden flex flex-col items-center justify-start overflow-y-auto ">
        {/* Mobile Header (brand) */}
        <div className="w-full max-w-md px-6 pt-8 mb-[52px]">
          <div className="flex flex-col items-center text-center gap-2">
            <Link href="/">
              <img
                src="/images/logo/logo-4.png"
                alt="Moderate Logo"
                width={44}
                height={44}
              />
            </Link>
            <h2 className="text-2xl font-semibold">Moderate</h2>
            <p className="text-gray-600 text-sm">Grade moderation made easy</p>
          </div>
        </div>
        <div className="w-full max-w-md pb-10 px-2">
          <RegisterForm showHeader={false} />
        </div>
      </div>

      {/* Desktop: Split layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12 w-full max-w-7xl h-screen items-center">
        <LoginScreen />
        <div className="h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="w-full max-h-screen overflow-y-auto scrollbar-hide">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
