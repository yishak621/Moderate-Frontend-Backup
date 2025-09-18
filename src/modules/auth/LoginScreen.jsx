"use client";
import Image from "next/image";

export default function LoginScreen() {
  return (
    <div className="z-233 p-4 pb-2 sm:p-6 lg:p-8">
      <div
        className="flex flex-col items-center justify-between relative w-full max-w-[1440px] mx-auto  rounded-[24px] sm:rounded-[32px] lg:rounded-[37px] overflow-hidden"
        style={{
          background:
            "url(/images/login-background.png) lightgray center/cover no-repeat",
          mixBlendMode: "soft-light",
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1072FF] via-[#3398FF] to-[#3C8AFF] opacity-80 z-0" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center w-full px-4 py-14  sm:px-6 lg:px-12   ">
          {/* Logo and title */}
          <div className="flex flex-col gap-2  w-full max-w-md xl:max-w-2xl">
            <h4 className="text-xl sm:text-2xl lg:text-3xl font-medium text-white">
              Moderate
            </h4>
            <p className="text-sm sm:text-base lg:text-lg font-normal text-[#F1F1F1]">
              Management Portal System
            </p>
          </div>
          {/* Brand Image (responsive, constrained by parent) */}
          <div className="flex justify-center items-center">
            <Image
              src="/images/brand.svg"
              alt="Brand"
              width={320}
              height={320}
              className="w-30 sm:w-40 lg:w-65 xl:w-80 2xl:w-[420px] h-auto object-contain"
              priority
            />
          </div>

          {/* Footer */}
          <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-center gap-2   text-center text-small  font-normal text-[#F1F1F1] ">
            <p>Moderate Tech</p>
            <p>© 2025 Moderate Tech. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
