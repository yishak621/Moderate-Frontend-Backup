"use client";

import { useModal } from "@/components/ui/Modal";
import { X, Mail, Calendar, CheckCircle2, XCircle, Clock, CreditCard, User as UserIcon, Building2, Shield, Activity, Tag } from "lucide-react";
import { User } from "@/app/types/user";
import UserAvatar from "@/components/UserAvatar";
import { timeAgo } from "@/lib/timeAgo";

export default function ViewUserModal({ user }: { user: User }) {
  const { close } = useModal();
  if (!user) return null;

  // Format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if trial has ended
  const isTrialEnded = user.freeTrialEndDate
    ? new Date(user.freeTrialEndDate) < new Date()
    : false;

  // Check if subscription is active
  const isSubscriptionActive = user.subscriptionStatus === "active";

  // Get subscription end date status
  const getSubscriptionStatus = () => {
    if (!user.subscriptionEndDate) return { status: "No subscription", color: "gray" };
    const endDate = new Date(user.subscriptionEndDate);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) {
      return { status: "Expired", color: "red" };
    } else if (daysRemaining <= 7) {
      return { status: `Expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`, color: "orange" };
    } else {
      return { status: `Active until ${formatDate(user.subscriptionEndDate)}`, color: "green" };
    }
  };

  const subscriptionStatus = getSubscriptionStatus();

  return (
    <div className="bg-[#FDFDFD] w-full min-w-[800px] max-w-[900px] max-h-[90vh] overflow-y-auto rounded-[27px] flex flex-col scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-[#FDFDFD] z-10 border-b border-gray-200 px-8 py-6 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <UserAvatar
            profilePictureUrl={user.profilePictureUrl || ""}
            name={user.name}
            email={user.email}
            size="lg"
            whiteRingPx={4}
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-[#0c0c0c]">{user.name}</h2>
            <div className="flex items-center gap-2 text-[#717171]">
              <Mail size={14} />
              <span className="text-base">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  user.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user.role || "TEACHER"}
              </span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  user.verificationStatus === "active"
                    ? "bg-green-100 text-green-700"
                    : user.verificationStatus === "suspended"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.verificationStatus?.toUpperCase() || "INACTIVE"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={close}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={22} className="text-[#000000] cursor-pointer" />
        </button>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6">
        {/* Account Information */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <UserIcon size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Account Information
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Account Status</p>
              <p className={`text-sm font-medium ${
                user.isDisabled ? "text-red-600" : "text-green-600"
              }`}>
                {user.isDisabled ? "Disabled" : "Active"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Email Verified</p>
              <p className={`text-sm font-medium ${
                user.isVerified ? "text-green-600" : "text-gray-600"
              }`}>
                {user.isVerified ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Account Created</p>
              <p className="text-sm text-gray-800">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Last Updated</p>
              <p className="text-sm text-gray-800">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Subscription Details
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Subscription Status</p>
              <div className="flex items-center gap-2">
                {isSubscriptionActive ? (
                  <CheckCircle2 size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-gray-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isSubscriptionActive ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {user.subscriptionStatus?.toUpperCase() || "FREE"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Subscription Plan</p>
              <p className="text-sm text-gray-800">
                {user.subscriptionPlan ? user.subscriptionPlan.toUpperCase() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Subscription End Date</p>
              <p className={`text-sm font-medium ${
                subscriptionStatus.color === "red"
                  ? "text-red-600"
                  : subscriptionStatus.color === "orange"
                  ? "text-orange-600"
                  : "text-green-600"
              }`}>
                {user.subscriptionEndDate ? formatDate(user.subscriptionEndDate) : "N/A"}
              </p>
              {user.subscriptionEndDate && (
                <p className="text-xs text-gray-500 mt-1">{subscriptionStatus.status}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Stripe Customer ID</p>
              <p className="text-sm text-gray-800 font-mono">
                {user.stripeCustomerId || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Free Trial Details */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Free Trial Details
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Trial Status</p>
              <div className="flex items-center gap-2">
                {user.hasUsedFreeTrial ? (
                  isTrialEnded ? (
                    <>
                      <XCircle size={16} className="text-red-600" />
                      <span className="text-sm font-medium text-red-600">Ended</span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">Active</span>
                    </>
                  )
                ) : (
                  <>
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-600">Available</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Trial Used</p>
              <p className="text-sm text-gray-800">
                {user.hasUsedFreeTrial ? "Yes" : "No"}
              </p>
            </div>
            {user.freeTrialStartDate && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Trial Start Date</p>
                <p className="text-sm text-gray-800">{formatDate(user.freeTrialStartDate)}</p>
              </div>
            )}
            {user.freeTrialEndDate && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Trial End Date</p>
                <p className={`text-sm font-medium ${
                  isTrialEnded ? "text-red-600" : "text-gray-800"
                }`}>
                  {formatDate(user.freeTrialEndDate)}
                  {isTrialEnded && (
                    <span className="ml-2 text-xs text-red-500">(Ended)</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Verification & Activity */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Verification & Activity
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Verification Status</p>
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  user.verificationStatus === "active"
                    ? "bg-green-100 text-green-700"
                    : user.verificationStatus === "suspended"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.verificationStatus?.toUpperCase() || "INACTIVE"}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Last Seen</p>
              <p className="text-sm text-gray-800">
                {user.lastSeen ? timeAgo(user.lastSeen) : "Never"}
              </p>
              {user.lastSeen && (
                <p className="text-xs text-gray-500 mt-1">{formatDateTime(user.lastSeen)}</p>
              )}
            </div>
            {user.lastVerified && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Last Verified</p>
                <p className="text-sm text-gray-800">{formatDateTime(user.lastVerified)}</p>
              </div>
            )}
            {user.lastVerificationSent && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Last Verification Sent</p>
                <p className="text-sm text-gray-800">{formatDateTime(user.lastVerificationSent)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Curricular Areas */}
        {user.domains && user.domains.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={18} className="text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Curricular Areas
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.domains.map((domain) => (
                <span
                  key={domain.id}
                  className="px-4 py-2 text-sm bg-white text-gray-700 rounded-full border border-gray-300 shadow-sm"
                >
                  {domain.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Additional Information
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">User ID</p>
              <p className="text-sm text-gray-800 font-mono">{user.id}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Email Domain</p>
              <p className="text-sm text-gray-800">{user.emailDomain || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
