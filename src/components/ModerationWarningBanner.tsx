"use client";

import { AlertTriangle, X, Gavel } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserModeration, ReportStats } from "@/types/moderation";
import Button from "@/components/ui/Button";

interface ModerationWarningBannerProps {
  moderation: UserModeration;
  reportStats?: ReportStats;
}

export default function ModerationWarningBanner({
  moderation,
  reportStats,
}: ModerationWarningBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const router = useRouter();

  // Show banner for active users with violations OR suspended/banned users
  const shouldShow =
    !isDismissed &&
    (moderation.status === "active"
      ? moderation.violationCount > 0
      : moderation.status === "suspended" ||
        moderation.status === "banned" ||
        moderation.status === "pending_review");

  if (!shouldShow) {
    return null;
  }

  const isSuspendedOrBanned =
    moderation.status === "suspended" ||
    moderation.status === "banned" ||
    moderation.status === "pending_review";

  return (
    <div
      className={`${
        isSuspendedOrBanned
          ? "bg-red-50 border-l-4 border-red-400"
          : "bg-orange-50 border-l-4 border-orange-400"
      } p-4 mb-4 rounded-r-lg`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={`${isSuspendedOrBanned ? "text-red-600" : "text-orange-600"} flex-shrink-0 mt-0.5`}
          size={20}
        />
        <div className="flex-1">
          <h3
            className={`text-sm font-semibold mb-1 ${
              isSuspendedOrBanned ? "text-red-800" : "text-orange-800"
            }`}
          >
            {isSuspendedOrBanned
              ? `Account ${moderation.status === "banned" ? "Banned" : "Suspended"}`
              : "Account Warning"}
          </h3>
          <div
            className={`text-sm space-y-1 ${
              isSuspendedOrBanned ? "text-red-700" : "text-orange-700"
            }`}
          >
            {moderation.status === "active" && (
              <>
                <p>
                  Your account has received <strong>{moderation.violationCount}</strong>{" "}
                  {moderation.violationCount === 1 ? "violation" : "violations"}.
                </p>
                {reportStats && (
                  <p>
                    You have been reported <strong>{reportStats.totalReports}</strong>{" "}
                    {reportStats.totalReports === 1 ? "time" : "times"}.
                  </p>
                )}
                <p className="text-xs mt-2">
                  A warning email has been sent to your registered email address. Please
                  review our community guidelines to avoid further violations.
                </p>
              </>
            )}
            {isSuspendedOrBanned && (
              <>
                <p>
                  Your account has been{" "}
                  <strong>
                    {moderation.status === "banned"
                      ? "permanently banned"
                      : moderation.status === "pending_review"
                      ? "pending review"
                      : "suspended"}
                  </strong>
                  .
                </p>
                {moderation.suspensionEndDate && (
                  <p>
                    Suspension ends:{" "}
                    {new Date(moderation.suspensionEndDate).toLocaleDateString()}
                  </p>
                )}
                {moderation.banReason && <p>Reason: {moderation.banReason}</p>}
                <div className="mt-3">
                  <Button
                    variant="primary"
                    onClick={() => router.push("/dashboard/teacher/appeals")}
                    className="text-xs py-1.5 px-3"
                  >
                    <Gavel size={14} className="mr-1" />
                    Submit Appeal
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className={`${isSuspendedOrBanned ? "text-red-600 hover:text-red-800" : "text-orange-600 hover:text-orange-800"} transition-colors flex-shrink-0`}
          aria-label="Dismiss warning"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

