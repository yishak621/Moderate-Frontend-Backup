"use client";

import CheckboxWithLabel from "@/components/CheckboxWithLabel";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextLink from "@/components/ui/Link";
import { useLogin } from "@/hooks/useAuth";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface LoginFormDataTypes {
  email: string;
  password: string;
}

export default function LoginForm({
  showHeader = true,
}: {
  showHeader?: boolean;
}) {
  const router = useRouter();
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormDataTypes>();
  //HOOKS
  const { login, loginAsync, user, isLoading, isSuccess, isError, error } =
    useLogin();

  const onSubmit = async (data: LoginFormDataTypes) => {
    setSubmittedEmail(data.email); // Store email for error handling
    try {
      const res = await loginAsync(data);
    } catch (err) {
      // Don't show error toast for suspended/banned users - handled in useEffect
      const errorData = err as any;
      if (
        errorData?.code === "ACCOUNT_BANNED" ||
        errorData?.code === "ACCOUNT_SUSPENDED"
      ) {
        // Error will be handled in useEffect with redirect
        return;
      }

      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        console.error("Unknown error", err);
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (isSuccess && user) {
      // Normal routing - backend will handle subscription checks
      if (user.role === "TEACHER") {
        router.push("/dashboard/teacher");
      } else if (user.role === "SYSTEM_ADMIN") {
        router.push("/dashboard/admin");
      }
    } else if (isError && error) {
      const errorData = error as any;
      const errorCode =
        errorData?.code ||
        errorData?.response?.data?.code ||
        ((error as AxiosError<{ code?: string }>)?.response?.data as any)?.code;

      // Handle payment required (402) - backend will return this when subscription is required
      // This covers: trial expired, checkout incomplete, or no active subscription
      if (
        errorCode === "PAYMENT_REQUIRED" ||
        errorCode === "CHECKOUT_INCOMPLETE" ||
        errorCode === "SUBSCRIPTION_REQUIRED" ||
        errorData?.requiresPayment ||
        errorData?.checkoutIncomplete ||
        errorData?.subscriptionRequired
      ) {
        // Redirect to payment required page with checkout URL if available
        const checkoutUrl = errorData?.checkoutUrl;
        const trialEndsAt = errorData?.trialEndsAt;
        const checkoutIncomplete =
          errorData?.checkoutIncomplete || errorCode === "CHECKOUT_INCOMPLETE";

        // Build query parameters
        const params = new URLSearchParams();
        params.set("noSubscription", "true"); // Always set this for subscription required
        if (checkoutUrl) {
          params.set("checkoutUrl", checkoutUrl);
        }
        if (trialEndsAt) {
          params.set("trialEndsAt", trialEndsAt);
        }
        if (checkoutIncomplete) {
          params.set("checkoutIncomplete", "true");
        }
        // Pass user email so backend can identify user without auth token
        if (submittedEmail) {
          params.set("email", submittedEmail);
        }

        const queryString = params.toString();
        router.push(`/payment/required${queryString ? `?${queryString}` : ""}`);
        return;
      }

      // Handle suspended/banned users - redirect to appeals
      if (
        (errorCode === "ACCOUNT_BANNED" || errorCode === "ACCOUNT_SUSPENDED") &&
        errorData?.requiresAppeal
      ) {
        // Show message
        toast.error(
          errorData.message || "Your account has been suspended or banned"
        );
        // Redirect to appeals page
        router.push("/dashboard/teacher/appeals");
        return;
      }

      // Check if it's a PENDING_ADMIN_VERIFICATION error
      if (errorCode === "PENDING_ADMIN_VERIFICATION") {
        // Use submitted email or try to get from error response
        const axiosError = error as AxiosError<{
          pendingVerification?: { adminEmail?: string };
        }>;
        const email =
          submittedEmail ||
          user?.email ||
          axiosError?.response?.data?.pendingVerification?.adminEmail ||
          "";

        if (email) {
          router.push(
            `/auth/domain-verify?email=${encodeURIComponent(
              email
            )}&code=${errorCode}`
          );
        }
      }
    }
  }, [isSuccess, user, router, isError, error, submittedEmail]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
      bg-[#fdfdfd]
      px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12
      rounded-[20px] sm:rounded-[24px]
      w-full max-w-md mx-auto
      flex flex-col gap-6 sm:gap-7
      shadow-lg
      border border-gray-100
    "
    >
      {/* Header */}
      {showHeader && (
        <Link
          href="/"
          className="flex flex-col items-center text-center gap-2 sm:gap-3 pb-6 sm:pb-8"
        >
          <Image
            src="/images/logo/logo-4.png"
            alt="Moderate Logo"
            width={50}
            height={50}
            priority
            className="object-contain select-none"
          />
          <h2 className="text-2xl sm:text-3xl font-semibold">Moderate</h2>
          <p className="text-gray-600 text-base font-normal sm:text-base">
            Grade moderation made easy
          </p>
        </Link>
      )}

      {/* Inputs */}
      <div className="flex flex-col gap-6 sm:gap-7">
        <Input
          label="School / Institutional Email"
          type="email"
          placeholder="you@example.com"
          error={errors?.email?.message}
          {...register("email", { required: "Email is required" })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="*********"
          error={errors?.password?.message}
          {...register("password", { required: "Password is required" })}
        />
      </div>

      {/* Remember + Forgot */}
      <div className="flex flex-row items-center justify-between mt-4 sm:mt-6">
        <CheckboxWithLabel
          label="Remember me"
          onChange={(val) => console.log("Checked:", val)}
        />
        <TextLink href="/auth/forgot-password" className="font-medium">
          Forgot Password?
        </TextLink>
      </div>

      {/* Button */}
      <Button
        type="submit"
        className={`justify-center mt-4 sm:mt-6 text-base cursor-pointer w-full transition 
        ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
      >
        {isLoading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
              ></path>
            </svg>
            Loging
          </>
        ) : (
          "Login"
        )}
      </Button>

      <div className="text-center text-sm sm:text-base mt-1">
        <span className="text-gray-600">Don’t have an account?</span>{" "}
        <Link
          href="/auth/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
