"use client";

import Link from "next/link";
import { useState } from "react";
import { FilterButtons } from "@/components/ui/FilterButtons";

const PlansData = [
  {
    title: "Free",
    monthlyPrice: "0",
    yearlyPrice: "0",
    features: ["1000 uploads", "1000 downloads", "1000 views"],
    moto: "For small schools and individual teachers",
  },
  {
    title: "Basic",
    monthlyPrice: "10",
    yearlyPrice: "100",
    features: ["1000 uploads", "1000 downloads", "1000 views"],
    moto: "For small schools and individual teachers",
  },
];

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 w-full flex flex-col items-center justify-center relative px-2">
      {/* Title with bottom portion hidden - less hidden on small screens */}
      <div className="overflow-hidden relative h-[60%] md:h-[85%]">
        <h1 className="text-[64px] sm:text-[80px] md:text-[100px] lg:text-[130px] xl:text-[160px] 2xl:text-[200px] font-bold text-center text-[#000] leading-tight sm:leading-normal mb-0">
          Pricing
        </h1>
      </div>

      {/* Cards positioned to overlap the hidden portion - less overlap on small screens */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[40px] xl:gap-[50px] -mt-4 sm:-mt-12 md:-mt-14 lg:-mt-16 xl:-mt-[72px] 2xl:-mt-20 relative z-10 w-full max-w-full px-2">
        {PlansData.map((plan) => (
          <PricingCard
            key={plan.title}
            {...plan}
            billingPeriod={billingPeriod}
          />
        ))}
      </div>
      {/* Toggle Button */}
      <div className="mt-8 sm:mt-10 md:mt-12 mb-6 sm:mb-8 w-full flex justify-center items-start px-2">
        <div className="flex justify-start items-center w-full sm:w-auto">
          <FilterButtons
            filters={["Monthly", "Yearly"]}
            activeFilter={billingPeriod === "monthly" ? "Monthly" : "Yearly"}
            onFilterChange={(filter) =>
              setBillingPeriod(filter === "Monthly" ? "monthly" : "yearly")
            }
          />
        </div>
      </div>
    </section>
  );
}
function PricingCard({
  title,
  monthlyPrice,
  yearlyPrice,
  features,
  moto,
  billingPeriod,
}: {
  title: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  moto: string;
  billingPeriod: "monthly" | "yearly";
}) {
  const price = billingPeriod === "monthly" ? monthlyPrice : yearlyPrice;
  const isFree = price === "0";

  return (
    <div className="p-6 sm:p-8 md:p-12 lg:p-[61px] rounded-[20px] sm:rounded-[28px] md:rounded-[35px] lg:rounded-[40px] bg-white/20 backdrop-blur-md border border-white/30 shadow-lg flex flex-col items-start relative w-full max-w-[485px]">
      <div className="w-full flex flex-col border-b-[2px] sm:border-b-[3px] border-b-[#EAEAEA] pb-6 sm:pb-8 md:pb-[28px]">
        <span className="text-[#838383] text-xs sm:text-sm md:text-base font-medium leading-normal">
          {moto}
        </span>

        <span className="text-[#000] text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-medium leading-tight">
          {price === "0" ? title : `$${price}`} /{" "}
          {billingPeriod === "monthly" ? "month" : "year"}
        </span>
      </div>
      <div className="flex flex-col items-start gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-12 lg:mt-[83px]">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex flex-row items-center gap-2 text-[#838383] text-xs sm:text-sm md:text-base font-medium leading-normal bg-[#f6f6f6] rounded-[24px] sm:rounded-[30px] md:rounded-[35px] lg:rounded-[41.5px] py-2.5 px-4 sm:py-3 sm:px-5 md:py-3.5 md:px-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 10 10"
              fill="none"
              className="flex-shrink-0"
            >
              <circle cx="5" cy="5" r="5" fill="black" />
            </svg>
            <span className="flex-1">{feature}</span>
          </div>
        ))}
      </div>
      <Link
        href="/auth/register"
        className={`w-full text-center mt-6 sm:mt-8 md:mt-12 lg:mt-[40px] 2xl:mt-[60px] inline-block ${
          isFree
            ? "bg-white text-[#000] border-2 border-black hover:bg-black hover:text-white hover:scale-105 hover:shadow-xl hover:shadow-black/20"
            : "bg-[#2997F1] text-white hover:bg-[#2178c9] hover:scale-105 hover:shadow-xl hover:shadow-[#2997F1]/40"
        } text-xs sm:text-sm md:text-base font-medium leading-normal px-4 py-2.5 sm:px-6 sm:py-3 md:px-6 md:py-3.5 rounded-full transition-all duration-300 transform hover:-translate-y-1 active:scale-100`}
      >
        Get Started
      </Link>
    </div>
  );
}
