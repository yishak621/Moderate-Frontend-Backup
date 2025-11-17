"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";

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
  const accentColor = isSuccess ? "#0560FD" : "#ef4444";
  const lightAccent = isSuccess ? "#89adeb" : "#fee2e2";
  const iconBg = isSuccess ? "bg-green-50" : "bg-red-50";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full bg-white rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 lg:p-16 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100/50"
        >
          <div className="flex flex-col items-center gap-8 sm:gap-10 lg:gap-12">
            {/* Logo and Brand */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href="/"
                className="flex flex-col items-center text-center gap-3 sm:gap-4"
              >
                <Image
                  src="/images/logo/logo-4.png"
                  alt="Moderate Logo"
                  width={80}
                  height={80}
                  priority
                  className="object-contain select-none"
                />
                <div>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-[#0C0C0C] mb-2">
                    Moderate
                  </h2>
                  <p className="text-[#717171] text-base sm:text-lg font-normal">
                    Grade moderation made easy
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
                style={{ color: accentColor }}
              >
                {title}
              </h1>
              <p className="text-[#717171] text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto">
                {message}
              </p>
            </motion.div>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-full"
            >
              <div
                className={`w-full ${iconBg} border-2 rounded-2xl p-6 sm:p-8 flex items-center gap-4 sm:gap-6`}
                style={{
                  borderColor: `${accentColor}30`,
                }}
              >
                <div className="flex-shrink-0">{icon}</div>
                <div className="flex-1 text-left">
                  {isSuccess && (
                    <p className="text-sm sm:text-base font-bold text-[#717171] mb-2">
                      A receipt has been sent to your email address from Stripe.
                    </p>
                  )}
                  <p
                    className="text-base sm:text-lg font-semibold mb-1"
                    style={{ color: accentColor }}
                  >
                    {isSuccess ? "Payment Confirmed" : "Payment Unsuccessful"}
                  </p>
                  <p className="text-sm sm:text-base text-[#717171]">
                    {isSuccess
                      ? "Your subscription is now active"
                      : "Please check your payment method"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-md"
            >
              <Link
                href={primaryButtonHref}
                className="flex-1 group relative overflow-hidden"
              >
                <div
                  className="w-full inline-flex justify-center items-center gap-2.5 rounded-full font-medium text-base sm:text-lg transition-all duration-300 cursor-pointer h-14 sm:h-16 px-8 bg-transparent hover:bg-gray-50 border-2 transform active:scale-95"
                  style={{
                    backgroundColor: accentColor,
                    color: "#FDFDFD",
                    borderColor: accentColor,
                  }}
                >
                  <span className="relative z-10">{primaryButtonText}</span>
                </div>
              </Link>
              <Link
                href={secondaryButtonHref}
                className="flex-1 inline-flex justify-center items-center gap-2.5 rounded-full font-medium text-base sm:text-lg transition-all duration-300 cursor-pointer h-14 sm:h-16 px-8 bg-white text-[#0C0C0C] hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
              >
                {secondaryButtonText}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <p className="text-sm sm:text-base text-[#717171]">
            Need help?{" "}
            <Link
              href="/contact"
              className="font-medium hover:underline"
              style={{ color: accentColor }}
            >
              Contact our support team
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
