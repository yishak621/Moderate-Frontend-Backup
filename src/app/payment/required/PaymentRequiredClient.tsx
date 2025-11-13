"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, Clock, AlertCircle, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import PlanSelectionModal from "@/components/PlanSelectionModal";
import {
  useCreateCheckoutSession,
  usePlansPublic,
} from "@/hooks/usePublicRoutes";
import { Plan } from "@/types/admin.type";

export default function PaymentRequiredClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isCheckoutIncomplete, setIsCheckoutIncomplete] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const { plans } = usePlansPublic();
  const { createCheckout, isLoading: isCreatingCheckout } =
    useCreateCheckoutSession();

  useEffect(() => {
    const url = searchParams.get("checkoutUrl");
    const trialEnd = searchParams.get("trialEndsAt");
    const checkoutIncomplete = searchParams.get("checkoutIncomplete");
    const email = searchParams.get("email");

    if (url) {
      setCheckoutUrl(decodeURIComponent(url));
    }
    if (trialEnd) {
      setTrialEndsAt(decodeURIComponent(trialEnd));
    }
    if (checkoutIncomplete === "true") {
      setIsCheckoutIncomplete(true);
    }
    if (email) {
      setUserEmail(decodeURIComponent(email));
    }
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const handleUpgrade = () => {
    // Always show plan selection modal so user can choose their plan
    setIsPlanModalOpen(true);
  };

  const handlePlanSelect = async (plan: "monthly" | "yearly") => {
    try {
      // Find the plan based on selected type
      const selectedPlan = plans?.find(
        (p: Plan) =>
          p.interval?.toLowerCase() ===
            (plan === "monthly" ? "month" : "year") && p.isActive
      );

      if (!selectedPlan || !selectedPlan.stripePriceId) {
        toast.error("Plan not available. Please try again.");
        return;
      }

      // Create checkout session with selected plan
      // Pass email if available (for unauthenticated users)
      // Pass plan type ("monthly" or "yearly") for backend metadata
      const newCheckoutUrl = await createCheckout({
        planName: selectedPlan.name,
        stripePriceId: selectedPlan.stripePriceId,
        email: userEmail || undefined,
        plan: plan, // ✅ Send plan type for backend metadata
      });

      if (newCheckoutUrl) {
        setIsPlanModalOpen(false);
        setIsRedirecting(true);
        toast.success("Redirecting to checkout...");
        window.location.href = newCheckoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to create checkout session");
      } else {
        toast.error("Failed to create checkout session. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
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

            {/* Alert Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-100 flex items-center justify-center"
            >
              <AlertCircle
                className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600"
                strokeWidth={2.5}
              />
            </motion.div>

            {/* Title and Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                {isCheckoutIncomplete
                  ? "Complete Your Subscription Setup"
                  : "Free Trial Expired"}
              </h1>
              <p className="text-[#717171] text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto">
                {isCheckoutIncomplete
                  ? "Please complete your subscription setup to access the platform. Complete the checkout process to continue using Moderate Tech."
                  : "Your 30-day free trial has ended. "}
              </p>
            </motion.div>

            {/* Trial End Date Info or Checkout Incomplete Info */}
            {isCheckoutIncomplete ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-full bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 sm:p-8 flex items-start gap-4"
              >
                <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-base sm:text-lg font-semibold text-blue-900 mb-1">
                    Subscription Setup Required
                  </p>
                  <p className="text-sm sm:text-base text-blue-700">
                    Your subscription checkout process was not completed. Please
                    complete the checkout to activate your subscription and
                    access all features.
                  </p>
                </div>
              </motion.div>
            ) : (
              trialEndsAt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="w-full bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 sm:p-8 flex items-start gap-4"
                >
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-base sm:text-lg font-semibold text-blue-900 mb-1">
                      Trial Ended
                    </p>
                    <p className="text-sm sm:text-base text-blue-700">
                      Your free trial ended on{" "}
                      <span className="font-semibold">
                        {formatDate(trialEndsAt)}
                      </span>
                      . Upgrade now to restore access.
                    </p>
                  </div>
                </motion.div>
              )
            )}

            {/* Features Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="w-full bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                What you&apos;ll get with a paid plan:
              </h3>
              <ul className="space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                  <span>
                    Full access to all grading and moderation features
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                  <span>Unlimited exams and student management</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                  <span>Priority support and updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                  <span>Cancel anytime, no long-term commitment</span>
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-md"
            >
              <Button
                onClick={handleUpgrade}
                disabled={isRedirecting || isCreatingCheckout}
                className="flex-1 justify-center items-center gap-2.5 h-14 sm:h-16 text-base sm:text-lg font-medium"
              >
                {isRedirecting || isCreatingCheckout ? (
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
                    {isCreatingCheckout
                      ? "Creating checkout..."
                      : "Redirecting..."}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Upgrade Now
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
              <Link
                href="/pricing"
                className="flex-1 inline-flex justify-center items-center gap-2.5 rounded-full font-medium text-base sm:text-lg transition-all duration-300 cursor-pointer h-14 sm:h-16 px-8 bg-white text-[#0C0C0C] hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
              >
                View Plans
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <p className="text-sm sm:text-base text-[#717171]">
            Need help?{" "}
            <Link
              href="/contact"
              className="font-medium hover:underline text-blue-600"
            >
              Contact our support team
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Plan Selection Modal */}
      <PlanSelectionModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onPlanSelect={handlePlanSelect}
        isLoading={isCreatingCheckout}
      />
    </div>
  );
}
