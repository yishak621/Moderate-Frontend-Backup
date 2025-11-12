"use client";

import CheckboxWithLabel from "@/components/CheckboxWithLabel";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextLink from "@/components/ui/Link";
import Link from "next/link";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useSignup } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useSubjectDomains } from "@/hooks/usePublicRoutes";
import { SubjectDomain } from "@/types/typeLog";
import { useEffect, useState } from "react";
import { SignupFormDataTypes } from "@/types/authData.type";
import Image from "next/image";
import PlanSelectionModal from "@/components/PlanSelectionModal";

export default function RegisterForm() {
  const router = useRouter();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<SignupFormDataTypes | null>(null);

  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<SignupFormDataTypes>();
  //HOOKS
  const { subjectDomains } = useSubjectDomains();

  const optionsSubjectDomains = subjectDomains?.map((item: SubjectDomain) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const {
    signup,
    signupAsync,
    user,
    isLoading,
    isSuccess,
    isError,
    error: signupError,
  } = useSignup();

  const onSubmit = async (data: SignupFormDataTypes) => {
    // Store form data and show plan selection modal
    setPendingFormData(data);
    setIsPlanModalOpen(true);
  };

  const handlePlanSelect = async (plan: "monthly" | "yearly") => {
    if (!pendingFormData) return;

    try {
      // Add plan to form data
      const registrationData = {
        ...pendingFormData,
        plan,
      };

      const res = await signupAsync(registrationData);

      // Close modal
      setIsPlanModalOpen(false);

      // Check if registration returned a checkout URL (Stripe subscription setup)
      if (res?.checkoutUrl) {
        toast.success("Redirecting to payment setup...");
        // Redirect to Stripe Checkout
        window.location.href = res.checkoutUrl;
        return;
      }

      // If no checkout URL, proceed with email verification flow
      toast.success("Registered successfully!");
    } catch (err: any) {
      console.log("RAW ERROR:", err);

      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 403 && message === "Email domain not allowed!") {
        setIsPlanModalOpen(false);
        return router.push(
          `/auth/domain-verify?email=${pendingFormData.email}`
        );
      }

      toast.error(message || "Something went wrong");
    }
  };

  useEffect(() => {
    // Only redirect to verify-email if registration succeeded without checkout URL
    // (checkout URL redirects happen immediately in onSubmit, so this handles legacy flow)
    if (isSuccess && user && !user?.checkoutUrl) {
      router.push("/auth/verify-email");
    }
  }, [isSuccess, router, user]);

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
      <div className="flex flex-col items-center text-center gap-2 sm:gap-3 pb-6 sm:pb-8">
        <Link href="/">
          <Image
            src="/images/logo/logo-4.png"
            alt="Moderate Logo"
            width={50}
            height={50}
            priority
            className="object-contain select-none"
          />
        </Link>

        <h2 className="text-2xl sm:text-3xl font-semibold">Moderate</h2>
        <p className="text-gray-600 text-base font-normal sm:text-base">
          Grade moderation made easy
        </p>
        <div className="mt-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs sm:text-sm text-blue-700">
            🎉 Start with a{" "}
            <span className="font-semibold">30-day free trial</span>. Card
            required but won&apos;t be charged until trial ends.
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-6 sm:gap-7">
        <Input
          label="Name"
          type="text"
          placeholder="Enter Your Name"
          error={errors?.name?.message}
          {...register("name", { required: "Name is required" })}
        />

        <Input
          label="School / Institutional Email"
          type="email"
          placeholder="you@example.com"
          {...register("email", { required: "Email is required" })}
          error={errors?.email?.message}
        />
        <Input
          label="Password"
          type="password"
          placeholder="*********"
          error={errors?.password?.message}
          {...register("password", { required: "Password is required" })}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="*********"
          error={errors?.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
        />
        <div>
          <p className="text-[#0c0c0c] text-sm sm:text-base font-normal mb-1">
            Subject Domains
          </p>
          <Controller
            name="subjectDomains"
            control={control}
            render={({ field }) => (
              <CustomMultiSelect
                options={optionsSubjectDomains}
                onChange={field.onChange}
                placeholder="Search and select subjects..."
              />
            )}
          />
        </div>
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
            Signing up...
          </>
        ) : (
          "Signup"
        )}
      </Button>

      <div className="text-center text-sm sm:text-base mt-1">
        <span className="text-gray-600">Already have an account?</span>{" "}
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Log in
        </Link>
      </div>

      {/* Plan Selection Modal */}
      <PlanSelectionModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setPendingFormData(null);
        }}
        onPlanSelect={handlePlanSelect}
        isLoading={isLoading}
      />
    </form>
  );
}
