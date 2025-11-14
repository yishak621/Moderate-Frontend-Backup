"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  Receipt,
  Calendar,
  DollarSign,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useBillingPortal } from "@/hooks/useSubscription";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface InvoicesSectionProps {
  user: {
    stripeCustomerId?: string | null;
    subscriptionStatus?: string;
    subscriptions?: any[];
  };
}

export default function InvoicesSection({ user }: InvoicesSectionProps) {
  const { createBillingPortal, isLoading } = useBillingPortal();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const hasStripeCustomer = !!user.stripeCustomerId;
  const hasActiveSubscription =
    user.subscriptionStatus === "active" ||
    user.subscriptions?.some((sub) => sub.status === "active");

  const handleViewInvoices = async () => {
    try {
      setIsRedirecting(true);
      toast.loading("Opening billing portal...");
      const portalUrl = await createBillingPortal();
      if (portalUrl) {
        window.location.href = portalUrl;
      }
    } catch (error) {
      setIsRedirecting(false);
      console.error("Error opening billing portal:", error);
    }
  };

  if (!hasStripeCustomer && !hasActiveSubscription) {
    return null; 
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto mt-12 sm:mt-16 md:mt-20 px-4"
    >
      <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Receipt className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Invoices & Billing
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                View, download, and manage your invoices and payment methods
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-3 sm:mb-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
              View Invoices
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Access all your payment history and invoices
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-100 flex items-center justify-center mb-3 sm:mb-4">
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
              Download PDFs
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Download invoice PDFs for your records
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-3 sm:mb-4">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
              Update Payment
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Manage your payment methods securely
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-3 sm:mb-4">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
              Billing History
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Complete transaction history
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-5 mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-1">
                Secure Billing Portal
              </h4>
              <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                All billing operations are handled securely through Stripe&apos;s
                customer portal. You&apos;ll be redirected to a secure page where
                you can view invoices, update payment methods, and manage your
                subscription.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={handleViewInvoices}
            disabled={isLoading || isRedirecting}
            className="flex-1 justify-center items-center gap-2.5 h-12 sm:h-14 text-base sm:text-lg font-medium"
          >
            {isLoading || isRedirecting ? (
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
                Opening portal...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                View All Invoices
                <ExternalLink className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>

        {/* Security Note */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Secured by Stripe • Your payment information is encrypted
          </p>
        </div>
      </div>
    </motion.div>
  );
}

