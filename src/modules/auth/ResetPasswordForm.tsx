"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useResetPassword } from "@/hooks/useAuth";
import { ResetPasswordFormDataTypes } from "@/types/authData.type";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useParams();

  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<ResetPasswordFormDataTypes>();
  //HOOKS

  const {
    resetPassword,
    resetPasswordAsync,
    user,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useResetPassword();

  const onSubmit = async (data: ResetPasswordFormDataTypes) => {
    const resetToken = Array.isArray(params.resetToken)
      ? params.resetToken[0]!
      : params.resetToken!;
    console.log(resetToken, params.resetToken);
    try {
      // Await the login mutation
      const res = await resetPasswordAsync({ data, resetToken });

      // Show success toast if login succeeded
      if (isSuccess) {
        toast.success("Registered successfully!");
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
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
      bg-[#fdfdfd]
      px-4 py-6                    
      sm:px-6 sm:py-8             
      lg:px-8 lg:py-12            
      rounded-[20px] sm:rounded-[24px]
      w-full max-w-lg mx-auto
      flex flex-col gap-5 sm:gap-6
      max-h-screen overflow-y-scroll scrollbar-hide
    "
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2 pb-4 sm:pb-6 lg:pb-8">
        <Image
          src="/images/logo/logo-4.png"
          alt="Moderate Logo"
          width={45}
          height={45}
          priority
          className="object-contain select-none"
        />
        <h2 className="text-xl sm:text-2xl font-semibold">Moderate</h2>
        <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
          Teacher Portal System
        </p>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-5 sm:gap-6">
        <Input
          label="Password"
          type="password"
          placeholder="*********"
          error={errors?.password?.message}
          {...register("password", { required: "Password is required!" })}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="*********"
          error={errors?.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Confirm Password is required!",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
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
            Updating Password...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
}
