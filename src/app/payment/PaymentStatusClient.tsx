"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import LoginScreen from "@/modules/auth/LoginScreen";

interface PaymentStatusClientProps {
  status: "success" | "failed";
  title: string;
  message: string;
  icon: ReactNode;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
}

export default function PaymentStatusClient({
  status,
  title,
  message,
  icon,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
}: PaymentStatusClientProps) {
  const isSuccess = status === "success";
  const bgColor = isSuccess ? "bg-green-50" : "bg-red-50";
  const borderColor = isSuccess ? "border-green-200" : "border-red-200";
  const iconBg = isSuccess ? "bg-green-100" : "bg-red-100";
  const textColor = isSuccess ? "text-green-800" : "text-red-800";

  return (
    <div className="h-screen bg-[#f1f1f1] flex items-center justify-center sm:p-6 lg:p-8">
      {/* Mobile/Tablet: Only show status card */}
      <div className="w-full h-screen lg:hidden flex items-center justify-center">
        <div className="w-full max-w-md">
          <div
            className={`
            bg-[#fdfdfd]
            px-6 py-8 sm:px-8 sm:py-10
            rounded-[20px] sm:rounded-[24px]
            w-full
            flex flex-col items-center gap-6 sm:gap-7
            shadow-lg
            border border-gray-100
          `}
          >
            {/* Header */}
            <Link
              href="/"
              className="flex flex-col items-center text-center gap-2 sm:gap-3"
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

            {/* Status Icon */}
            <div
              className={`${iconBg} rounded-full p-4 flex items-center justify-center`}
            >
              {icon}
            </div>

            {/* Title */}
            <h1
              className={`text-2xl sm:text-3xl font-bold text-center ${textColor}`}
            >
              {title}
            </h1>

            {/* Message */}
            <p className="text-gray-600 text-base sm:text-lg text-center leading-relaxed">
              {message}
            </p>

            {/* Status Card */}
            <div
              className={`w-full ${bgColor} border-2 ${borderColor} rounded-xl p-4 sm:p-6`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 ${iconBg} rounded-full p-2`}>
                  {icon}
                </div>
                <div>
                  <p
                    className={`text-sm sm:text-base font-semibold ${textColor} mb-1`}
                  >
                    {isSuccess ? "Payment Confirmed" : "Payment Unsuccessful"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {isSuccess
                      ? "Your subscription is now active"
                      : "Please check your payment method"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-3">
              <Link
                href={primaryButtonHref}
                className="w-full inline-flex justify-center items-center gap-2.5 rounded-lg font-normal text-base transition-colors duration-200 cursor-pointer h-12 px-6 py-3 bg-[#368FFF] text-[#FDFDFD] hover:bg-[#2574db]"
              >
                {primaryButtonText}
              </Link>
              <Link
                href={secondaryButtonHref}
                className="w-full inline-flex justify-center items-center gap-2.5 rounded-lg font-normal text-base transition-colors duration-200 cursor-pointer h-12 px-6 py-3 bg-[#FDFDFD] text-[#0C0C0C] hover:bg-[#e5e5e5] border border-[#DBDBDB]"
              >
                {secondaryButtonText}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Split layout with LoginScreen */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12 w-full max-w-7xl h-screen items-center">
        <LoginScreen />
        <div className="h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="w-full max-h-screen overflow-y-auto scrollbar-hide">
              <div
                className={`
                bg-[#fdfdfd]
                px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12
                rounded-[20px] sm:rounded-[24px]
                w-full
                flex flex-col items-center gap-6 sm:gap-7
                shadow-lg
                border border-gray-100
              `}
              >
                {/* Header */}
                <Link
                  href="/"
                  className="flex flex-col items-center text-center gap-2 sm:gap-3"
                >
                  <Image
                    src="/images/logo/logo-4.png"
                    alt="Moderate Logo"
                    width={50}
                    height={50}
                    priority
                    className="object-contain select-none"
                  />
                  <h2 className="text-2xl sm:text-3xl font-semibold">
                    Moderate
                  </h2>
                  <p className="text-gray-600 text-base font-normal sm:text-base">
                    Grade moderation made easy
                  </p>
                </Link>

                {/* Status Icon */}
                <div
                  className={`${iconBg} rounded-full p-4 flex items-center justify-center`}
                >
                  {icon}
                </div>

                {/* Title */}
                <h1
                  className={`text-2xl sm:text-3xl font-bold text-center ${textColor}`}
                >
                  {title}
                </h1>

                {/* Message */}
                <p className="text-gray-600 text-base sm:text-lg text-center leading-relaxed">
                  {message}
                </p>

                {/* Status Card */}
                <div
                  className={`w-full ${bgColor} border-2 ${borderColor} rounded-xl p-4 sm:p-6`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 ${iconBg} rounded-full p-2`}>
                      {icon}
                    </div>
                    <div>
                      <p
                        className={`text-sm sm:text-base font-semibold ${textColor} mb-1`}
                      >
                        {isSuccess
                          ? "Payment Confirmed"
                          : "Payment Unsuccessful"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {isSuccess
                          ? "Your subscription is now active"
                          : "Please check your payment method"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col gap-3">
                  <Link
                    href={primaryButtonHref}
                    className="w-full inline-flex justify-center items-center gap-2.5 rounded-lg font-normal text-base transition-colors duration-200 cursor-pointer h-12 px-6 py-3 bg-[#368FFF] text-[#FDFDFD] hover:bg-[#2574db]"
                  >
                    {primaryButtonText}
                  </Link>
                  <Link
                    href={secondaryButtonHref}
                    className="w-full inline-flex justify-center items-center gap-2.5 rounded-lg font-normal text-base transition-colors duration-200 cursor-pointer h-12 px-6 py-3 bg-[#FDFDFD] text-[#0C0C0C] hover:bg-[#e5e5e5] border border-[#DBDBDB]"
                  >
                    {secondaryButtonText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
