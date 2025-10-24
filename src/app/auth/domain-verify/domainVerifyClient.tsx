"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import StepIndicator from "@/components/StepIndicator";
import Image from "next/image";
import { CircleAlert } from "lucide-react";
import {
  domainVerifyFormDataTypes,
  loginFormDataTypes,
} from "@/types/authData.type";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDomainVerify, useLogin } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";

const steps = [
  {
    title: "Domain Check",
    desc: "Enter your school admin email",
  },
  {
    title: "Verification Sent",
    desc: "We sent a verification link to the school admin. You can change the email if it was incorrect.",
  },
  {
    title: "Pending Approval",
    desc: "We received the verification. Your account will be activated once the admin approves it.",
  },
];

export default function DomainVerification() {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<domainVerifyFormDataTypes>();

  const schoolDomainAdminEmail = watch("teacherEmail");
  const {
    domainVerify,
    domainVerifyAsync,
    user,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useDomainVerify();

  const searchParams = useSearchParams();

  const onSubmit = async (data: domainVerifyFormDataTypes) => {
    const teacherEmail = searchParams.get("email") as string;
    try {
      const res = await domainVerifyAsync({ ...data, teacherEmail });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        console.error("Unknown error", err);
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setStep(1);
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  px-6 py-6  md:py-12 overflow-y-scroll scrollbar-hide">
      <StepIndicator steps={steps} current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white shadow-lg rounded-2xl p-7 border border-gray-200 text-center"
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
              Grade moderation made easy
            </p>
          </div>

          {step === 0 && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <div className="w-full bg-[#FFF4E5] text-[#AD8A59] py-4 px-7 rounded-lg mt-4">
                <div className="flex flex-row items-start gap-3">
                  <CircleAlert className="w-[17px] h-[17px] flex-shrink-0 mt-1.5" />

                  <p className="text-sm font-normal text-left">
                    Your institution or workplace email domain has not been
                    validated. To ensure only educators are on the platform,
                    please validate your educational institution.
                  </p>
                </div>
              </div>
              <Input
                label="Please enter your school, educational workplace or educational institution's email address."
                type="email"
                placeholder="E.g. admin@yourschool.edu"
                error={errors?.email?.message}
                defaultValue={schoolDomainAdminEmail}
                className="mt-1"
                {...register("email", {
                  required: "School / Institutional Admin Email is required",
                })}
              />

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
                    Sending...
                  </>
                ) : (
                  "Send Verification Link"
                )}
              </Button>
            </form>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-3">
              <div className="text-sm text-gray-600">
                We have send a verification link to the school admin which is{" "}
                <span className="font-medium">{schoolDomainAdminEmail}</span>.
                You can change the email if it was incorrect.
              </div>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                I Confirm
              </button>
              <button
                onClick={() => setStep(0)}
                className="text-sm text-blue-600 underline"
              >
                Change Email
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center text-center py-8">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Success Title */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Verification Received!
              </h3>

              {/* Success Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                We have successfully received your domain verification request.
                Your account will be activated once the school administrator
                approves your request.
              </p>

              {/* Status Card */}
              <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-800">
                      Awaiting Admin Approval
                    </p>
                    <p className="text-xs text-blue-600">
                      You will receive an email notification once approved
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => (window.location.href = "/auth/login")}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Go to Homepage
                </button>
                <button
                  onClick={() => (window.location.href = "/static/features")}
                  className="w-full text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
                >
                  Discover our features
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
