"use client";

import { useState, useEffect } from "react";
import { X, Check, Sparkles, Shield, Zap } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { usePlansPublic } from "@/hooks/usePublicRoutes";
import { Plan } from "@/types/admin.type";
import Button from "@/components/ui/Button";

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelect: (plan: "monthly" | "yearly") => void;
  isLoading?: boolean;
}

export default function PlanSelectionModal({
  isOpen,
  onClose,
  onPlanSelect,
  isLoading = false,
}: PlanSelectionModalProps) {
  const { plans, isLoading: plansLoading } = usePlansPublic();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | null>(
    null
  );

  // Filter and get monthly and yearly plans
  const monthlyPlan = plans?.find(
    (plan: Plan) => plan.interval?.toLowerCase() === "month" && plan.isActive
  );
  const yearlyPlan = plans?.find(
    (plan: Plan) => plan.interval?.toLowerCase() === "year" && plan.isActive
  );

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPlan(null);
    }
  }, [isOpen]);

  const handleSelectPlan = (planType: "monthly" | "yearly") => {
    setSelectedPlan(planType);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      onPlanSelect(selectedPlan);
    }
  };

  const formatPrice = (price: string) => {
    return parseFloat(price || "0").toFixed(2);
  };

  const calculateYearlySavings = () => {
    if (!monthlyPlan || !yearlyPlan) return null;
    const monthly = parseFloat(monthlyPlan.price || "0");
    const yearly = parseFloat(yearlyPlan.price || "0");
    const monthlyYearly = monthly * 12;
    if (monthlyYearly > yearly) {
      const savings = ((monthlyYearly - yearly) / monthlyYearly) * 100;
      return Math.round(savings);
    }
    return null;
  };

  const savings = calculateYearlySavings();

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Content
        width="w-full md:w-[95vw]"
        panelClassName="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-h-[100vh] overflow-y-auto"
        closeOnOverlayClick={false}
      >
        <div className="p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-5 sm:mb-8">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                Choose Your Plan
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Select a plan to get started with your 30-day free trial
              </p>
            </div>
            <Modal.Close className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </Modal.Close>
          </div>

          {/* Trial Info Banner */}
          <div className="mb-5 sm:mb-8 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-1">
                  🎉 30-Day Free Trial Guaranteed
                </h3>
                <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                  <strong>No charges now!</strong> Your card will only be charged
                  after your 30-day free trial ends. Cancel anytime during the
                  trial with no penalty. Start exploring all features risk-free.
                </p>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          {plansLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-8">
              {/* Monthly Plan */}
              {monthlyPlan && (
                <PlanCard
                  plan={monthlyPlan}
                  planType="monthly"
                  isSelected={selectedPlan === "monthly"}
                  onSelect={() => handleSelectPlan("monthly")}
                  isPopular={false}
                />
              )}

              {/* Yearly Plan */}
              {yearlyPlan && (
                <PlanCard
                  plan={yearlyPlan}
                  planType="yearly"
                  isSelected={selectedPlan === "yearly"}
                  onSelect={() => handleSelectPlan("yearly")}
                  isPopular={true}
                  savings={savings}
                />
              )}
            </div>
          )}

          {/* Features List */}
          <div className="mb-5 sm:mb-8 p-4 sm:p-5 bg-gray-50 rounded-xl">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
              What&apos;s included in both plans:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {[
                "Full access to all grading features",
                "Unlimited exams and moderators",
                "Advanced moderation tools",
                "Priority support",
                "Regular feature updates",
                "Cancel anytime",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedPlan || isLoading}
              className="flex-1 justify-center items-center gap-2 h-11 sm:h-14 text-sm sm:text-base font-medium"
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
                  Processing...
                </>
              ) : (
                <>
                  Continue with {selectedPlan === "monthly" ? "Monthly" : selectedPlan === "yearly" ? "Yearly" : "Plan"}
                  <Zap className="w-5 h-5" />
                </>
              )}
            </Button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-6 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-4 sm:mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secure payment powered by Stripe. Your data is safe.</span>
            </div>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}

interface PlanCardProps {
  plan: Plan;
  planType: "monthly" | "yearly";
  isSelected: boolean;
  onSelect: () => void;
  isPopular: boolean;
  savings?: number | null;
}

function PlanCard({
  plan,
  planType,
  isSelected,
  onSelect,
  isPopular,
  savings,
}: PlanCardProps) {
  const formatPrice = (price: string) => {
    return parseFloat(price || "0").toFixed(2);
  };

  return (
    <div
      onClick={onSelect}
      className={`relative p-6 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
          : isPopular
          ? "border-blue-300 bg-white hover:border-blue-400 hover:shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
          Most Popular
        </div>
      )}

      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 flex items-center justify-center">
          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
          {plan.name || (planType === "monthly" ? "Monthly" : "Yearly")}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          {plan.description || `${planType === "monthly" ? "Flexible monthly billing" : "Best value with annual billing"}`}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            ${formatPrice(plan.price || "0")}
          </span>
          <span className="text-sm sm:text-base text-gray-600">
            /{plan.interval?.toLowerCase() === "year" ? "year" : "month"}
          </span>
        </div>
        {savings && planType === "yearly" && (
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs sm:text-sm font-semibold rounded">
              Save {savings}%
            </span>
          </div>
        )}
        <div className="mt-2">
          <span className="text-sm sm:text-base text-blue-600 font-medium">
            ✓ 30 days free trial
          </span>
        </div>
      </div>

      {plan.features && plan.features.length > 0 && (
        <div className="space-y-2 sm:space-y-3 mt-4">
          {plan.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

