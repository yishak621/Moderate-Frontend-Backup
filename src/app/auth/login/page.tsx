import type { Metadata } from "next";
import LoginForm from "@/modules/auth/LoginForm";
import LoginScreen from "@/modules/auth/LoginScreen";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Login to your Moderate Tech account. Access your school management dashboard, grading tools, announcements, and more.",
  keywords: [
    "login",
    "sign in",
    "school management login",
    "teacher login",
    "admin login",
    "education platform login",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Login | Moderate Tech",
    description: "Login to your Moderate Tech account to access your dashboard.",
    url: "/auth/login",
  },
  alternates: {
    canonical: "/auth/login",
  },
};

export default function LoginPage() {
  return (
    <div className="h-screen bg-[#f1f1f1] flex items-center justify-center  sm:p-6 lg:p-8">
      {/* Mobile/Tablet: Login Form only - Full screen */}
      <div className="w-full h-screen lg:hidden flex items-center justify-center ">
        <div className="w-full max-w-md">
          <LoginForm />
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
