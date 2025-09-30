"use client";
import makeAnimated from "react-select/animated";

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

interface SignupFormDataTypes {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  subjectDomains: string[];
}

export default function RegisterForm() {
  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };

  const router = useRouter();
  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<SignupFormDataTypes>();
  //HOOKS
  const {
    subjectDomains,
    isLoading: issubjectDomainsLoading,
    isSuccess: issubjectDomainsSuccess,
    isError: issubjectDomainsError,
    error,
  } = useSubjectDomains();

  const optionsSubjectDomains = subjectDomains?.map((item: SubjectDomain) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const { signup, signupAsync, user, isLoading, isSuccess, isError } =
    useSignup();

  const onSubmit = async (data: SignupFormDataTypes) => {
    try {
      // Await the login mutation
      const res = await signupAsync(data); // if using react-query mutateAsync
      console.log("Login response:", res);

      // Show success toast if login succeeded
      if (res?.token) {
        toast.success("Logged in successfully!");
      } else {
        toast.error("Login failed! No token returned.");
      }
    } catch (err: any) {
      // Show error toast
      toast.error(err?.response?.data?.message || "Login failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#fdfdfd] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 2xl:px-12 2xl:py-14 rounded-[24px] w-full max-w-lg mx-auto  flex flex-col gap-6 max-h-screen overflow-scroll scrollbar-hide"
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 pb-2 sm:pb-2 lg:pb-4 ">
        <h2 className="text-2xl font-semibold text-dark">Moderate</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Teacher Portal System
        </p>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-5 sm:gap-6">
        <Input
          label="Name"
          type="text"
          placeholder="Enter Your Name"
          error={errors?.name?.message}
          {...register("name", { required: "Name is required" })}
        />

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
          {...register("password", { required: "Password is required" })}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="*********"
          {...register("confirmPassword", {
            required: "Password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
        />
        <div>
          <p className="text-[#0c0c0c] text-base font-normal mb-1">
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
    </form>
  );
}
