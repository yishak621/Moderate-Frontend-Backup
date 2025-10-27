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
    <section className="py-20 w-full flex flex-col items-center justify-center relative">
      {/* Title with bottom portion hidden */}
      <div className="overflow-hidden relative" style={{ height: "85%" }}>
        <h1 className="sm:text-[150px] 2xl:text-[200px] font-bold text-center text-[#000] leading-normal">
          Pricing
        </h1>
      </div>

      {/* Cards positioned to overlap the hidden portion with glass effect */}
      <div className="flex flex-row justify-center gap-[50px] -mt-18 relative z-10">
        {PlansData.map((plan) => (
          <PricingCard
            key={plan.title}
            {...plan}
            billingPeriod={billingPeriod}
          />
        ))}
      </div>
      {/* Toggle Button */}
      <div className="mt-8 mb-8 w-full flex justify-center items-start">
        <div className="flex justify-start">
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
    <div className="p-[61px] rounded-[40px] bg-white/20 backdrop-blur-md border border-white/30 shadow-lg flex flex-col items-start relative">
      <div className=" flex flex-col border-b-[3px] border-b-[#EAEAEA] pb-[28px]">
        <span className="text-[#838383] text-base font-medium leading-normal">
          {moto}
        </span>

        <span className="text-[#000] text-[48px] font-medium leading-normal">
          {price === "0" ? title : `$${price}`} /{" "}
          {billingPeriod === "monthly" ? "month" : "year"}
        </span>
      </div>
      <div className="flex flex-col items-start gap-8 mt-[83px]">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex flex-row items-center gap-2.5 text-[#838383] text-base font-medium leading-normal bg-[#f6f6f6] rounded-[41.5px] py-3.5 px-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <circle cx="5" cy="5" r="5" fill="black" />
            </svg>{" "}
            {feature}
          </div>
        ))}
      </div>
      <Link
        href="/auth/register"
        className={`w-full text-center 2xl:mt-[60px] mt-[40px] inline-block ${
          isFree
            ? "bg-white text-[#000] border-2 border-black hover:bg-black hover:text-white hover:scale-105 hover:shadow-xl hover:shadow-black/20"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
        } text-base font-medium leading-normal px-6 py-3.5 rounded-full transition-all duration-300 transform hover:-translate-y-1 active:scale-100`}
      >
        Get Started
      </Link>
    </div>
  );
}
