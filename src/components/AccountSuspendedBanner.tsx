"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getModerationStatus, getToken } from "@/services/tokenService";

export default function AccountSuspendedBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const router = useRouter();
  const moderationStatus = getModerationStatus();

  // Only show if user is suspended, banned, or pending review
  const shouldShow =
    !isDismissed &&
    moderationStatus &&
    (moderationStatus === "suspended" ||
      moderationStatus === "banned" ||
      moderationStatus === "pending_review");

  if (!shouldShow) {
    return null;
  }

  const getStatusText = () => {
    switch (moderationStatus) {
      case "banned":
        return "permanently banned";
      case "pending_review":
        return "pending review";
      case "suspended":
        return "suspended";
      default:
        return "restricted";
    }
  };

  const isBanned = moderationStatus === "banned";

  return (
    <div
      className={`w-full ${
        isBanned ? "bg-red-600" : "bg-orange-600"
      } text-white py-3 px-4 shadow-lg z-50`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <AlertTriangle className="flex-shrink-0" size={20} />
          <div className="flex-1">
            <p className="text-sm font-semibold">
              Your account has been {getStatusText()}
            </p>
            <p className="text-xs mt-0.5 opacity-90">
              {isBanned
                ? "You cannot access the platform. Please submit an appeal and wait for admin review."
                : "Your access to the platform is restricted. Please submit an appeal and wait for admin review."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isBanned && getToken() && (
            <button
              onClick={() => router.push("/dashboard/teacher/appeals")}
              className="text-xs font-medium bg-white text-orange-600 px-4 py-1.5 rounded hover:bg-orange-50 transition-colors"
            >
              Submit Appeal
            </button>
          )}
          {!isBanned && !getToken() && (
            <button
              onClick={() => router.push("/auth/login")}
              className="text-xs font-medium bg-white text-orange-600 px-4 py-1.5 rounded hover:bg-orange-50 transition-colors"
            >
              Login to Appeal
            </button>
          )}
          <button
            onClick={() => setIsDismissed(true)}
            className="text-white hover:text-gray-200 transition-colors flex-shrink-0"
            aria-label="Dismiss banner"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

