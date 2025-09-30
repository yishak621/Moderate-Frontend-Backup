"use client";

import CheckboxWithLabel from "@/components/CheckboxWithLabel";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextLink from "@/components/ui/Link";
import { useLogin } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface LoginFormDataTypes {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormDataTypes>();
  //HOOKS
  const { login, loginAsync, user, isLoading, isSuccess, isError } = useLogin();

  const onSubmit = async (data: LoginFormDataTypes) => {
    try {
      // Await the login mutation
      const res = await loginAsync(data); // if using react-query mutateAsync
      console.log("Login response:", res);

      // Show success toast if login succeeded
      if (res?.token) {
        toast.success("Registered successfully!");
      } else {
        toast.error("Regiseration Failed! Try Again!");
      }
    } catch (err: any) {
      // Show error toast
      toast.error(err?.response?.data?.message || "Login failed!");
    }
  };

  useEffect(() => {
    if (isSuccess && user && user.role === "TEACHER") {
      router.push("/dashboard/teacher");
    } else if (isSuccess && user && user.role === "SYSTEM_ADMIN") {
      router.push("/dashboard/admin");
    }
  }, [isSuccess, user, router]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#fdfdfd] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 rounded-[24px] w-full max-w-lg mx-auto flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 pb-6 sm:pb-4 lg:pb-10">
        <h2 className="text-2xl font-semibold text-dark">Moderate</h2>
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
      <div className="flex flex-row items-center justify-between mt-2 sm:mt-4">
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
