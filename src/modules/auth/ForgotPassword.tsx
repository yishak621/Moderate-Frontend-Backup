"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useForgotPassword } from "@/hooks/useAuth";
import { forgotPasswordFormDataTypes } from "@/types/authData.type";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ForgotPasswordForm() {
  const router = useRouter();
  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<forgotPasswordFormDataTypes>();

  const {
    forgotPassword,
    forgotPasswordAsync,
    user,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useForgotPassword();

  const onSubmit = async (data: forgotPasswordFormDataTypes) => {
    try {
      // Await the login mutation
      const res = await forgotPasswordAsync(data);

      // Show success toast if login succeeded
      if (isSuccess) {
        toast.success(
          "Password reset link sent. Please check your email inbox."
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        toast.error(err.message);
      } else {
        console.error("Unknown error", err);
        toast.error("Something went wrong");
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="bg-white  rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle2 className="mx-auto text-green-500 w-16 h-16 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 ">
            Password Reset Link Sent
          </h2>
          <p className="text-gray-600  mt-2">
            Please check your email inbox and follow the instructions to reset
            your password.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Button variant="secondary">
              <Link
                href="/auth/login"
                className="font-normal text-base text-[#0C0C0C] "
              >
                Back to Login
              </Link>
            </Button>
          </div>

          <p className="text-sm text-gray-500  mt-4">
            Didn’t receive the email?{" "}
            <button className="text-blue-600 hover:underline">Resend</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#fdfdfd] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 rounded-[24px] w-full max-w-lg mx-auto flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 pb-6 sm:pb-4 lg:pb-10">
        <h2 className="text-2xl font-semibold ">Moderate</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Teacher Portal System
        </p>
      </div>
      {/* Inputs */}
      <div className="flex flex-col gap-5 sm:gap-6">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors?.email?.message}
          {...register("email", { required: "Email is required!" })}
        />
      </div>
      {/* Button */}
      <Button
        type="submit"
        className={`justify-center mt-2.5 sm:mt-4 text-base cursor-pointer w-full transition 
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
            Sending Reset Link...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>

      <div className="text-center text-sm sm:text-base mt-1">
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </form>
  );
}
