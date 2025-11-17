import type { Metadata } from "next";
import LoginForm from "@/modules/auth/LoginForm";
import LoginScreen from "@/modules/auth/LoginScreen";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to your Moderate Tech account to access collaborative test moderation tools, grading workflows, and teacher-focused insights.",
  keywords: [
    "login",
    "sign in",
    "test moderation login",
    "teacher login",
    "assessment platform access",
    "grading workflow login",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Login | Moderate Tech",
    description:
      "Access your Moderate Tech dashboard to collaborate on test moderation and grading alignment.",
    url: "/auth/login",
  },
  alternates: {
    canonical: "/auth/login",
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen lg:h-screen bg-[#f1f1f1] flex items-center justify-center sm:p-6 lg:p-8">
      {/* Mobile/Tablet: Login Form only - Full screen */}
      <div className="w-full min-h-screen lg:hidden flex flex-col items-center justify-start overflow-y-auto">
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
          <LoginForm showHeader={false} />
        </div>
      </div>

      {/* Desktop: Split layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12 w-full max-w-7xl h-screen items-center">
        <LoginScreen />
        <div className="h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="w-full max-h-screen overflow-y-auto scrollbar-hide">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
