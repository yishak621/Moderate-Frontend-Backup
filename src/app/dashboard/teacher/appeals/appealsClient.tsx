"use client";

import { useState } from "react";
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useUserData } from "@/hooks/useUser";
import {
  useUserModerationDetails,
  useMyAppeals,
  useCreateAppeal,
} from "@/hooks/useModeration";
import { UserModeration, Appeal } from "@/types/moderation";
import { timeAgo } from "@/lib/timeAgo";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import CreateAppealModal from "@/modules/dashboard/teacher/modal/CreateAppealModal";
import SectionLoading from "@/components/SectionLoading";
import { EmptyState } from "@/components/EmptyStateProps";

export default function AppealsClient() {
  const { user } = useUserData();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: moderationData, isLoading: isLoadingModeration } =
    useUserModerationDetails(user?.id || "", {
      enabled: !!user?.id,
    });
  const { data: myAppeals, isLoading: isLoadingAppeals } = useMyAppeals();

  const moderation = moderationData?.moderation;
  const appeals = myAppeals || [];

  // Check if user can create an appeal
  // Allow creating appeal if:
  // 1. User is suspended/banned/pending_review AND no pending appeal exists
  // 2. OR if moderation data is not loaded yet (show button to allow attempt)
  const canCreateAppeal = moderation
    ? (moderation.status === "suspended" ||
        moderation.status === "banned" ||
        moderation.status === "pending_review") &&
      !appeals.some((appeal) => appeal.status === "pending")
    : !appeals.some((appeal) => appeal.status === "pending"); // Show button if no moderation data yet

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { label: string; icon: any; className: string }
    > = {
      pending: {
        label: "Pending Review",
        icon: Clock,
        className: "bg-yellow-100 text-yellow-700",
      },
      accepted: {
        label: "Accepted",
        icon: CheckCircle2,
        className: "bg-green-100 text-green-700",
      },
      rejected: {
        label: "Rejected",
        icon: XCircle,
        className: "bg-red-100 text-red-700",
      },
    };
    return configs[status] || configs.pending;
  };

  const getModerationStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      active: { label: "Active", className: "bg-green-100 text-green-700" },
      suspended: {
        label: "Suspended",
        className: "bg-orange-100 text-orange-700",
      },
      banned: { label: "Banned", className: "bg-red-100 text-red-700" },
      pending_review: {
        label: "Pending Review",
        className: "bg-yellow-100 text-yellow-700",
      },
    };
    return configs[status] || configs.active;
  };

  if (isLoadingModeration || isLoadingAppeals) {
    return <SectionLoading />;
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full max-w-full overflow-hidden px-3 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2">
          <Scale className="text-blue-500" size={20} />
          <h1 className="text-xl sm:text-2xl font-semibold text-[#0C0C0C]">
            Account Appeals
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#717171]">
          Submit an appeal if you believe your account moderation was incorrect
        </p>
      </div>

      {/* Current Status */}
      {moderation && (
        <div className="bg-[#FDFDFD] border border-[#DBDBDB] rounded-2xl p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-[#0C0C0C] mb-3 sm:mb-4">
            Current Account Status
          </h2>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-[#717171]">Status</span>
              <span
                className={`px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-full ${
                  getModerationStatusConfig(moderation.status).className
                }`}
              >
                {getModerationStatusConfig(moderation.status).label}
              </span>
            </div>
            {moderation.violationCount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#717171]">Violations</span>
                <span className="text-xs sm:text-sm font-medium text-[#0C0C0C]">
                  {moderation.violationCount}
                </span>
              </div>
            )}
            {moderation.suspensionStartDate && (
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#717171]">Suspension Start</span>
                <span className="text-xs sm:text-sm text-[#0C0C0C]">
                  {new Date(
                    moderation.suspensionStartDate
                  ).toLocaleDateString()}
                </span>
              </div>
            )}
            {moderation.suspensionEndDate && (
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#717171]">Suspension End</span>
                <span className="text-xs sm:text-sm text-[#0C0C0C]">
                  {new Date(moderation.suspensionEndDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {moderation.bannedAt && (
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#717171]">Ban Date</span>
                <span className="text-xs sm:text-sm text-red-600 font-medium">
                  {new Date(moderation.bannedAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {moderation.banReason && (
              <div className="flex flex-col gap-1">
                <span className="text-xs sm:text-sm text-[#717171]">Ban Reason</span>
                <span className="text-xs sm:text-sm text-[#0C0C0C]">
                  {moderation.banReason}
                </span>
              </div>
            )}
          </div>

          {/* Create Appeal Button */}
          {canCreateAppeal && (
            <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-200">
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
              >
                <Scale size={16} className="mr-2" />
                Create Appeal
              </Button>
            </div>
          )}

          {!canCreateAppeal && moderation && moderation.status !== "active" && (
            <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-200">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 sm:p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    className="text-yellow-600 flex-shrink-0 mt-0.5"
                    size={14}
                  />
                  <p className="text-[11px] sm:text-xs text-yellow-700">
                    {appeals.some((appeal) => appeal.status === "pending")
                      ? "You already have a pending appeal. Please wait for admin review."
                      : "You cannot create an appeal at this time."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show Create Appeal Button if no moderation data but user wants to appeal */}
      {!moderation && !isLoadingModeration && (
        <div className="bg-[#FDFDFD] border border-[#DBDBDB] rounded-2xl p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-[#0C0C0C] mb-3 sm:mb-4">
            Create Appeal
          </h2>
          <p className="text-xs sm:text-sm text-[#717171] mb-3 sm:mb-4">
            If you believe your account has been incorrectly moderated, you can
            submit an appeal.
          </p>
          {canCreateAppeal && (
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
            >
              <Scale size={16} className="mr-2" />
              Create Appeal
            </Button>
          )}
        </div>
      )}

      {/* My Appeals */}
      <div className="bg-[#FDFDFD] border border-[#DBDBDB] rounded-2xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-[#0C0C0C] mb-3 sm:mb-4">
          My Appeals
        </h2>
        {appeals.length === 0 ? (
          <EmptyState
            title="No appeals submitted yet"
            description="You haven't submitted any appeals. Create one if you believe your account moderation was incorrect."
          />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {appeals.map((appeal) => {
              const statusConfig = getStatusConfig(appeal.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div
                  key={appeal.id}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon
                        className={`${
                          statusConfig.className
                            .replace("bg-", "text-")
                            .replace("text-", "")
                            .split(" ")[0]
                        }`}
                        size={16}
                      />
                      <span
                        className={`px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-full ${statusConfig.className}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-[#717171]">
                      {timeAgo(appeal.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#0C0C0C] mb-2">{appeal.reason}</p>
                  {appeal.adminNotes && (
                    <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-gray-200">
                      <p className="text-[11px] sm:text-xs font-medium text-[#717171] mb-1">
                        Admin Response:
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#0C0C0C]">
                        {appeal.adminNotes}
                      </p>
                    </div>
                  )}
                  {appeal.reviewedAt && (
                    <p className="text-[11px] sm:text-xs text-[#717171] mt-1.5 sm:mt-2">
                      Reviewed: {new Date(appeal.reviewedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Appeal Modal */}
      <Modal isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <Modal.Content>
          <CreateAppealModal
            moderation={moderation}
            onSuccess={() => setIsCreateModalOpen(false)}
            onClose={() => setIsCreateModalOpen(false)}
          />
        </Modal.Content>
      </Modal>
    </div>
  );
}
