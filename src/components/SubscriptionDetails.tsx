"use client";

import { useMemo } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  DollarSign,
  History,
  Info,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { SubscriptionDetailsProps } from "@/types/subscription.type";

// Date formatting utilities
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

const getDaysRemaining = (endDate: string) => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export default function SubscriptionDetails({
  user,
}: SubscriptionDetailsProps) {
  const activeSubscription = useMemo(() => {
    if (!user.subscriptions || user.subscriptions.length === 0) return null;
    return user.subscriptions.find((sub) => sub.status === "active");
  }, [user.subscriptions]);

  const subscriptionHistory = useMemo(() => {
    if (!user.subscriptions || user.subscriptions.length === 0) return [];
    return user.subscriptions
      .filter((sub) => sub.id !== activeSubscription?.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5); // Show last 5 subscriptions
  }, [user.subscriptions, activeSubscription]);

  const formatCurrency = (amount: number, currency: string = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-300",
        icon: CheckCircle2,
        label: "Active",
      },
      canceled: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-300",
        icon: XCircle,
        label: "Canceled",
      },
      past_due: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-300",
        icon: Clock,
        label: "Past Due",
      },
      trialing: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-300",
        icon: Clock,
        label: "Trial",
      },
    };

    const config =
      statusMap[status as keyof typeof statusMap] || statusMap.active;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text} ${config.border} border text-sm font-medium`}
      >
        <Icon size={14} />
        <span>{config.label}</span>
      </div>
    );
  };

  const getPlanBadge = (plan: string) => {
    const isYearly = plan.toLowerCase() === "yearly";
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
          isYearly
            ? "bg-purple-100 text-purple-700 border-purple-300"
            : "bg-blue-100 text-blue-700 border-blue-300"
        } border text-sm font-semibold`}
      >
        <Crown size={14} />
        <span className="uppercase">{plan}</span>
      </div>
    );
  };

  if (!activeSubscription && user.subscriptionStatus !== "active") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Info size={32} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No Active Subscription
          </h3>
          <p className="text-gray-600 mb-6">
            {user.hasUsedFreeTrial
              ? "Your free trial has ended. Upgrade to continue using Moderate Tech."
              : "Start your free trial or choose a plan to get started."}
          </p>
        </div>
      </div>
    );
  }

  const daysRemaining = activeSubscription
    ? getDaysRemaining(activeSubscription.currentPeriodEnd)
    : user.subscriptionEndDate
    ? getDaysRemaining(user.subscriptionEndDate)
    : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Current Active Subscription Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left Section - Main Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {getStatusBadge(
                activeSubscription?.status ||
                  user.subscriptionStatus ||
                  "active"
              )}
              {getPlanBadge(
                activeSubscription?.plan || user.subscriptionPlan || "monthly"
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Current Subscription
              </h2>
              <p className="text-gray-600">
                {activeSubscription?.plan === "yearly"
                  ? "Annual Plan - Best Value"
                  : "Monthly Plan - Flexible Billing"}
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <DollarSign size={18} />
                  <span className="text-sm font-medium">Amount</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {activeSubscription
                    ? formatCurrency(
                        activeSubscription.amount,
                        activeSubscription.currency
                      )
                    : "$4.99"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activeSubscription?.plan === "yearly" ? "/year" : "/month"}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar size={18} />
                  <span className="text-sm font-medium">Renews</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {activeSubscription
                    ? formatDate(activeSubscription.currentPeriodEnd)
                    : user.subscriptionEndDate
                    ? formatDate(user.subscriptionEndDate)
                    : "—"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {daysRemaining > 0 ? `${daysRemaining} days left` : "Expired"}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Clock size={18} />
                  <span className="text-sm font-medium">Started</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {activeSubscription
                    ? formatDate(activeSubscription.currentPeriodStart)
                    : "—"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Period start</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <CreditCard size={18} />
                  <span className="text-sm font-medium">Customer ID</span>
                </div>
                <p className="text-sm font-mono font-semibold text-gray-700 truncate">
                  {activeSubscription?.stripeCustomerId || "—"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Stripe</p>
              </div>
            </div>
          </div>

          {/* Right Section - Visual Indicator */}
          <div className="flex flex-col items-center justify-center md:min-w-[200px]">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Crown size={48} className="text-white" />
              </div>
              {daysRemaining > 0 && daysRemaining <= 7 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <Clock size={16} className="text-white" />
                </div>
              )}
            </div>
            {activeSubscription?.cancelAtPeriodEnd && (
              <div className="mt-4 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-sm font-medium text-yellow-800">
                  ⚠️ Cancels at period end
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription History */}
      {subscriptionHistory.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <History size={24} className="text-gray-700" />
            <h3 className="text-2xl font-bold text-gray-900">
              Subscription History
            </h3>
          </div>

          <div className="space-y-4">
            {subscriptionHistory.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {getPlanBadge(sub.plan)}
                    {getStatusBadge(sub.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(sub.currentPeriodStart)} -{" "}
                      {formatDate(sub.currentPeriodEnd)}
                    </span>
                    <span className="flex items-center gap-1">
                      {formatCurrency(sub.amount, sub.currency)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {formatDate(sub.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Free Trial Info */}
      {user.hasUsedFreeTrial && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Free Trial Completed
              </h4>
              <p className="text-gray-600 text-sm">
                You&apos;ve already used your free trial. Upgrade to a paid plan
                to continue accessing all features.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
