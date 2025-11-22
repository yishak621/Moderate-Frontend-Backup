export type ReportCategory =
  | "spam"
  | "harassment"
  | "inappropriate_content"
  | "fake_account"
  | "copyright"
  | "other";

export type ModerationStatus =
  | "active"
  | "suspended"
  | "banned"
  | "pending_review";

export type ModerationActionType =
  | "warning"
  | "suspension"
  | "ban"
  | "unsuspend"
  | "unban"
  | "appeal_created"
  | "appeal_accepted"
  | "appeal_rejected";

export type AppealStatus = "pending" | "accepted" | "rejected";

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  category: ReportCategory;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  reporter?: {
    id: string;
    name: string;
    email: string;
  };
  reported?: {
    id: string;
    name: string;
    email: string;
  };
  reportedUserActions?: AvailableActions;
}

export interface UserModeration {
  id: string;
  userId: string;
  status: ModerationStatus;
  violationCount: number;
  suspendedAt?: string;
  suspendedUntil?: string;
  suspensionStartDate?: string;
  suspensionEndDate?: string;
  bannedAt?: string;
  banReason?: string;
  lastViolationDate?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  availableActions?: AvailableActions;
}

export interface ModerationAction {
  id: string;
  userId: string;
  actionType: ModerationActionType;
  performedBy: string;
  reason?: string;
  duration?: number; // in days for suspensions
  notes?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  performer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Appeal {
  id: string;
  userId: string;
  moderationId: string;
  reason: string;
  status: AppealStatus;
  adminNotes?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  moderation?: UserModeration;
}

export interface CreateReportInput {
  reportedId: string;
  reason: string;
  category: ReportCategory;
}

export interface CreateAppealInput {
  moderationId?: string; // Optional - can use moderationActionId instead
  moderationActionId?: string; // Optional - for linking to specific moderation action
  reason: string; // Minimum 10 characters
}

export interface ReviewAppealInput {
  status: "accepted" | "rejected";
  adminNotes?: string;
}

export interface SuspendUserInput {
  duration?: number; // days, if not provided, uses system default
  reason?: string;
}

export interface BanUserInput {
  reason: string;
}

export interface UnbanUserInput {
  reason: string;
}

export interface ReportStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  violationCount: number;
  lastReportDate?: string;
}

export interface AvailableActions {
  canSuspend: boolean;
  canBan: boolean;
  canUnsuspend: boolean;
  canUnban: boolean;
  violationCount: number;
  currentStatus: ModerationStatus;
  hasReports: boolean;
}