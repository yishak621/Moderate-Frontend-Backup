"use client";

import { useMemo, useState, useEffect } from "react";
import {
  usePlansPublic,
  useCreateCheckoutSession,
} from "@/hooks/usePublicRoutes";
import { Plan } from "@/types/admin.type";
import toast from "react-hot-toast";
import { getToken } from "@/services/tokenService";
import { jwtDecode } from "jwt-decode";
import { customJwtPayload } from "@/types/postAttributes";
import Link from "next/link";

export default function PricingSection() {
  //hooks
  const { plans, isLoading, isSuccess, isError, error } = usePlansPublic();

  // Filter and sort active plans (show both monthly and yearly together)
  const filteredPlans = useMemo(() => {
    if (!plans || !Array.isArray(plans)) return [];

    return plans
      .filter((plan: Plan) => plan.isActive)
      .sort((a: Plan, b: Plan) => {
        // Sort by sortOrder if available, otherwise by interval (monthly first)
        if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
          return a.sortOrder - b.sortOrder;
        }
        // Sort monthly before yearly
        if (
          a.interval?.toLowerCase() === "month" &&
          b.interval?.toLowerCase() === "year"
        ) {
          return -1;
        }
        if (
          a.interval?.toLowerCase() === "year" &&
          b.interval?.toLowerCase() === "month"
        ) {
          return 1;
        }
        return parseFloat(a.price || "0") - parseFloat(b.price || "0");
      });
  }, [plans]);
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 w-full flex flex-col items-center justify-center relative px-2">
      {/* Title with bottom portion hidden - less hidden on small screens */}
      <div className="overflow-hidden relative h-[60%] md:h-[85%]">
        <h1 className="text-[64px] sm:text-[80px] md:text-[100px] lg:text-[130px] xl:text-[160px] 2xl:text-[200px] font-bold text-center text-[#000] leading-tight sm:leading-normal mb-0">
          Pricing
        </h1>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[40px] xl:gap-[50px] -mt-4 sm:-mt-12 md:-mt-14 lg:-mt-16 xl:-mt-[72px] 2xl:-mt-20 relative z-10 w-full max-w-full px-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-6 sm:p-8 md:p-12 lg:p-[61px] rounded-[20px] sm:rounded-[28px] md:rounded-[35px] lg:rounded-[40px] bg-white/20 backdrop-blur-md border border-white/30 shadow-lg w-full max-w-[485px] h-[400px] animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center -mt-4 sm:-mt-12 md:-mt-14 lg:-mt-16 xl:-mt-[72px] 2xl:-mt-20 relative z-10 px-2">
          <p className="text-red-500 text-center">
            {error instanceof Error
              ? error.message
              : "Failed to load pricing plans"}
          </p>
        </div>
      )}

      {/* Cards positioned to overlap the hidden portion - less overlap on small screens */}
      {!isLoading && isSuccess && filteredPlans.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[40px] xl:gap-[50px] -mt-4 sm:-mt-12 md:-mt-14 lg:-mt-16 xl:-mt-[72px] 2xl:-mt-20 relative z-10 w-full max-w-full px-2">
          {filteredPlans.map((plan: Plan) => (
            <PricingCard
              key={plan.id}
              id={plan.id}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              features={plan.features || []}
              isPopular={plan.isPopular}
              savings={plan.savings}
              interval={plan.interval}
              stripePriceId={plan.stripePriceId}
            />
          ))}
        </div>
      )}
    </section>
  );
}
function PricingCard({
  id,
  name,
  description,
  price,
  features,
  isPopular,
  savings,
  interval,
  stripePriceId,
}: {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  isPopular: boolean;
  savings: string | null;
  interval: string;
  stripePriceId?: string;
}) {
  const isFree = parseFloat(price || "0") === 0;
  const intervalText = interval?.toLowerCase() === "year" ? "year" : "month";
  const { createCheckout, isLoading: isCreatingCheckout } =
    useCreateCheckoutSession();

  // Check authentication state with useEffect
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = getToken();
        if (token) {
          const decoded = jwtDecode(token) as customJwtPayload;
          setIsAuthenticated(!!(decoded?.email && decoded?.email !== ""));
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleGetStarted = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!stripePriceId) {
      toast.error("Stripe price ID is missing. Please contact support.");
      return;
    }

    try {
      const checkoutUrl = await createCheckout({
        planName: name,
        stripePriceId,
      });
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create checkout session");
      }
    }
  };

  return (
    <div
      className={`p-6 sm:p-8 md:p-12 lg:p-[61px] rounded-[20px] sm:rounded-[28px] md:rounded-[35px] lg:rounded-[40px] bg-white/20 backdrop-blur-md border ${
        isPopular ? "border-[#2997F1] border-2" : "border-white/30"
      } shadow-lg flex flex-col items-start relative w-full max-w-[485px]`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#2997F1] text-white px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
          Most Popular
        </div>
      )}
      <div className="w-full flex flex-col border-b-[2px] sm:border-b-[3px] border-b-[#EAEAEA] pb-6 sm:pb-8 md:pb-[28px]">
        <span className="text-[#838383] text-xs sm:text-sm md:text-base font-medium leading-normal">
          {description}
        </span>

        <div className="flex flex-col gap-1">
          <span className="text-[#000] text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-medium leading-tight">
            ${price} / {intervalText}
          </span>
          {savings && (
            <span className="text-[#2997F1] text-xs sm:text-sm font-medium">
              {savings}
            </span>
          )}
          <span className="text-[#2997F1] text-xs sm:text-sm font-medium mt-1">
            30 days free trial
          </span>
        </div>
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
      {isAuthenticated ? (
        <button
          onClick={handleGetStarted}
          disabled={isCreatingCheckout || !stripePriceId}
          className={`w-full text-center mt-6 sm:mt-8 md:mt-12 lg:mt-[40px] 2xl:mt-[60px] cursor-pointer inline-block ${
            isFree
              ? "bg-white text-[#000] border-2 border-black hover:bg-black hover:text-white hover:scale-105 hover:shadow-xl hover:shadow-black/20"
              : "bg-[#2997F1] text-white hover:bg-[#2178c9] hover:scale-105 hover:shadow-xl hover:shadow-[#2997F1]/40"
          } ${
            isCreatingCheckout || !stripePriceId
              ? "opacity-50 cursor-not-allowed"
              : ""
          } text-xs sm:text-sm md:text-base font-medium leading-normal px-4 py-2.5 sm:px-6 sm:py-3 md:px-6 md:py-3.5 rounded-full transition-all duration-300 transform hover:-translate-y-1 active:scale-100`}
        >
          {isCreatingCheckout ? "Processing..." : "Subscribe Now"}
        </button>
      ) : !isCheckingAuth ? (
        <Link
          className={`w-full text-center mt-6 sm:mt-8 md:mt-12 lg:mt-[40px] 2xl:mt-[60px] cursor-pointer inline-block ${
            isFree
              ? "bg-white text-[#000] border-2 border-black hover:bg-black hover:text-white hover:scale-105 hover:shadow-xl hover:shadow-black/20"
              : "bg-[#2997F1] text-white hover:bg-[#2178c9] hover:scale-105 hover:shadow-xl hover:shadow-[#2997F1]/40"
          } text-xs sm:text-sm md:text-base font-medium leading-normal px-4 py-2.5 sm:px-6 sm:py-3 md:px-6 md:py-3.5 rounded-full transition-all duration-300 transform hover:-translate-y-1 active:scale-100`}
          href="/auth/register"
        >
          Get Started
        </Link>
      ) : (
        <div className="w-full text-center mt-6 sm:mt-8 md:mt-12 lg:mt-[40px] 2xl:mt-[60px] inline-block opacity-50">
          <div
            className={`${
              isFree
                ? "bg-white text-[#000] border-2 border-black"
                : "bg-[#2997F1] text-white"
            } text-xs sm:text-sm md:text-base font-medium leading-normal px-4 py-2.5 sm:px-6 sm:py-3 md:px-6 md:py-3.5 rounded-full`}
          >
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}
