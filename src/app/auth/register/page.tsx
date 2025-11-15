import type { Metadata } from "next";
import LoginScreen from "@/modules/auth/LoginScreen";
import RegisterForm from "@/modules/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your Moderate Tech account. Join schools and educational institutions using our comprehensive school management platform. Start with a free trial.",
  keywords: [
    "register",
    "sign up",
    "create account",
    "school management signup",
    "teacher registration",
    "education platform signup",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Register | Moderate Tech",
    description:
      "Create your Moderate Tech account and start managing your school effectively.",
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
            <img
              src="/images/logo/logo-4.png"
              alt="Moderate Logo"
              width={44}
              height={44}
            />
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
