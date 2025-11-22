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
import Link from "next/link";

const steps = [
  {
    title: "eMail domain verification.",
    desc: "Enter your school / institution / workplace email address. Your workplace admin team  will receive and email to confirm the email domain.",
  },
  {
    title: "Verification Sent",
    desc: "We have sent an email containing an domain confirmation link. Once the admin team of your institution has confirmed the validity of the domain, therefore confirming your educator status, your Moderate account will be activated.",
  },
  {
    title: "Awaiting Approval",
    desc: "We're waiting for your workplace admin team to confirm your email domain and educator status. Your account will be activated once approved by your workplace admin.",
  },
];

export default function DomainVerification() {
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email");
  const urlCode = searchParams.get("code");

  // Check if coming from PENDING_ADMIN_VERIFICATION error
  const isPendingVerification = urlCode === "PENDING_ADMIN_VERIFICATION";

  const [step, setStep] = useState(isPendingVerification ? 2 : 0);

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<domainVerifyFormDataTypes>();

  const schoolDomainAdminEmail = watch("email");
  const {
    domainVerify,
    domainVerifyAsync,
    user,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useDomainVerify();

  // Set email from URL if available and code is PENDING_ADMIN_VERIFICATION
  useEffect(() => {
    if (isPendingVerification && urlEmail) {
      setValue("email", urlEmail);
    }
  }, [isPendingVerification, urlEmail, setValue]);

  const onSubmit = async (data: domainVerifyFormDataTypes) => {
    const teacherEmail =
      (searchParams.get("email") as string) || urlEmail || "";
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

  const handleResendLink = () => {
    // Reset to step 0 to allow resending
    setStep(0);
    toast.success(
      "Please enter the admin email to resend the verification link"
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] px-4 py-6 sm:px-6 md:py-12 overflow-y-scroll scrollbar-hide">
      <StepIndicator steps={steps} current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full bg-[#fdfdfd] shadow-lg rounded-[20px] sm:rounded-[24px] p-7 border border-gray-100 text-center"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2 sm:gap-3 pb-6 sm:pb-8">
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
          </div>

          {step === 0 && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6 sm:gap-7"
            >
              <div className="w-full bg-[#FFF4E5] text-[#AD8A59] py-4 px-7 rounded-lg mt-4">
                <div className="flex flex-row items-start gap-3">
                  <CircleAlert className="w-[17px] h-[17px] flex-shrink-0 mt-1.5" />

                  <p className="text-sm font-normal text-left">
                    Your institution or workplace email domain has not been
                    validated. To ensure only Teachers are on the platform,
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
                We have sent a verification link to the institution / workplace
                admin at{" "}
                <span className="font-medium">{schoolDomainAdminEmail}</span>.
                You can change the email if it’s incorrect.
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
              {/* Icon */}
              <div
                className={`w-20 h-20 ${
                  isPendingVerification ? "bg-yellow-100" : "bg-green-100"
                } rounded-full flex items-center justify-center mb-6`}
              >
                {isPendingVerification ? (
                  <CircleAlert className="w-10 h-10 text-yellow-600" />
                ) : (
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
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {isPendingVerification
                  ? "Awaiting confirmation by your admin team."
                  : "Verification Request Received!"}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {isPendingVerification ? (
                  <>
                    Your account will be ready once your workplace admin team
                    access the link we have sent. Please contact your admin team
                    and inform them to check the given email address inbox for
                    our confirmation link. There is no further actions needed.
                    <br />
                    <br />
                    Once your workplace admin team has confirmed your email
                    domain, institution and educator status you will receive an
                    email from us in your workplace address inviting you to
                    login as your account will be activated and ready for you.
                  </>
                ) : (
                  <>
                    We have successfully received your domain verification
                    request. Your account will be activated once the school
                    administrator approves your request.
                  </>
                )}
              </p>

              {/* Status Card */}
              <div
                className={`w-full ${
                  isPendingVerification
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-blue-50 border-blue-200"
                } border rounded-lg p-4 mb-6`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 ${
                      isPendingVerification ? "bg-yellow-100" : "bg-blue-100"
                    } rounded-full flex items-center justify-center`}
                  >
                    <svg
                      className={`w-4 h-4 ${
                        isPendingVerification
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
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
                    <p
                      className={`text-sm font-medium ${
                        isPendingVerification
                          ? "text-yellow-800"
                          : "text-blue-800"
                      }`}
                    >
                      Awaiting Admin Approval
                    </p>
                    <p
                      className={`text-xs ${
                        isPendingVerification
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {isPendingVerification
                        ? "Check your email or resend the verification link if needed."
                        : "You'll receive an email notification once your request is approved."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full">
                {isPendingVerification && (
                  <Button
                    onClick={handleResendLink}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Resend Verification Link
                  </Button>
                )}
                <Link
                  href="/"
                  className={`w-full ${
                    isPendingVerification
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } py-3 px-4 rounded-lg font-medium transition-colors duration-200`}
                >
                  Go to Homepage
                </Link>
                <Link
                  href="/features"
                  className="w-full text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
                >
                  Discover our features
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
