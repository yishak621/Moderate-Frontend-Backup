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
    <div className="sm:h-screen bg-[#f1f1f1] flex items-center justify-center  sm:p-6 lg:p-8">
      {/* Mobile/Tablet: Only show form - Full screen */}
      <div className="mt-15 sm:mt-0 w-full h-screen lg:hidden flex items-center justify-center ">
        <div className="w-full max-w-md">
          <RegisterForm />
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
