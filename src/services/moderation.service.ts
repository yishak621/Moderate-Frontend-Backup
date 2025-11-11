import { axiosInstance } from "@/lib/axiosInstance";
import {
  Report,
  CreateReportInput,
  UserModeration,
  ModerationAction,
  Appeal,
  CreateAppealInput,
  ReviewAppealInput,
  SuspendUserInput,
  BanUserInput,
  ReportStats,
} from "@/types/moderation";

// ==================== REPORTS ====================

/**
 * Create a report against a user
 */
export const createReport = async (
  data: CreateReportInput
): Promise<Report> => {
  try {
    const res = await axiosInstance.post("/api/reports", data);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to create report"
    );
  }
};

/**
 * Get current user's reports
 */
export const getMyReports = async (): Promise<Report[]> => {
  try {
    const res = await axiosInstance.get("/api/reports/me");
    return res.data.reports || res.data || [];
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch reports"
    );
  }
};

/**
 * Get all reports (admin only)
 */
export const getAllReports = async (): Promise<Report[]> => {
  try {
    const res = await axiosInstance.get("/api/reports");
    return res.data.reports || res.data || [];
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch reports"
    );
  }
};

/**
 * Get reports for a specific user (admin only)
 */
export const getUserReports = async (userId: string): Promise<Report[]> => {
  try {
    const res = await axiosInstance.get(`/api/reports/user/${userId}`);
    return res.data.reports || res.data || [];
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch user reports"
    );
  }
};

/**
 * Get report statistics for a user (admin only)
 */
export const getUserReportStats = async (
  userId: string
): Promise<ReportStats> => {
  try {
    const res = await axiosInstance.get(`/api/reports/user/${userId}/stats`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch report stats"
    );
  }
};

/**
 * Resolve a report (admin only)
 */
export const resolveReport = async (
  reportId: string,
  resolutionNotes?: string
): Promise<Report> => {
  try {
    const res = await axiosInstance.patch(`/api/reports/${reportId}/resolve`, {
      resolutionNotes,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to resolve report"
    );
  }
};

// ==================== MODERATION ====================

/**
 * Get all moderated users (admin only)
 */
export const getModeratedUsers = async (): Promise<UserModeration[]> => {
  try {
    const res = await axiosInstance.get("/api/flagusermoderation/users");
    return res.data.users || res.data || [];
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch moderated users"
    );
  }
};

/**
 * Get users pending review (admin only)
 */
export const getPendingReviewUsers = async (): Promise<UserModeration[]> => {
  try {
    const res = await axiosInstance.get(
      "/api/flagusermoderation/users/pending-review"
    );
    return res.data.users || res.data || [];
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch pending review users"
    );
  }
};

/**
 * Get user moderation details (admin only)
 */
export const getUserModerationDetails = async (
  userId: string
): Promise<{
  moderation: UserModeration;
  reports: Report[];
  actions: ModerationAction[];
  appeals: Appeal[];
}> => {
  try {
    const res = await axiosInstance.get(
      `/api/flagusermoderation/user/${userId}`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch user moderation details"
    );
  }
};

/**
 * Suspend a user (admin only)
 */
export const suspendUser = async (
  userId: string,
  data?: SuspendUserInput
): Promise<UserModeration> => {
  try {
    const res = await axiosInstance.post(
      `/api/flagusermoderation/user/${userId}/suspend`,
      data || {}
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to suspend user"
    );
  }
};

/**
 * Unsuspend a user (admin only)
 */
export const unsuspendUser = async (
  userId: string
): Promise<UserModeration> => {
  try {
    const res = await axiosInstance.post(
      `/api/flagusermoderation/user/${userId}/unsuspend`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to unsuspend user"
    );
  }
};

/**
 * Ban a user (admin only)
 */
export const banUser = async (
  userId: string,
  data: BanUserInput
): Promise<UserModeration> => {
  try {
    const res = await axiosInstance.post(
      `/api/flagusermoderation/user/${userId}/ban`,
      data
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to ban user"
    );
  }
};

/**
 * Unban a user (admin only)
 */
export const unbanUser = async (userId: string): Promise<UserModeration> => {
  try {
    const res = await axiosInstance.post(
      `/api/flagusermoderation/user/${userId}/unban`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to unban user"
    );
  }
};

/**
 * Process expired suspensions (admin only, usually called by background job)
 */
export const processExpiredSuspensions = async (): Promise<{
  processed: number;
}> => {
  try {
    const res = await axiosInstance.post(
      "/api/flagusermoderation/process-expired-suspensions"
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to process expired suspensions"
    );
  }
};

// ==================== APPEALS ====================

/**
 * Create an appeal
 */
export const createAppeal = async (
  data: CreateAppealInput
): Promise<Appeal> => {
  try {
    const res = await axiosInstance.post("/api/appeals", data);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to create appeal"
    );
  }
};

/**
 * Get current user's appeals
 */
export const getMyAppeals = async (): Promise<Appeal[]> => {
  try {
    const res = await axiosInstance.get("/api/appeals/me");
    return res.data.appeals || res.data || [];
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch appeals"
    );
  }
};

/**
 * Get appeal by ID
 */
export const getAppealById = async (appealId: string): Promise<Appeal> => {
  try {
    const res = await axiosInstance.get(`/api/appeals/${appealId}`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch appeal"
    );
  }
};

/**
 * Get all appeals (admin only)
 */
export const getAllAppeals = async (): Promise<Appeal[]> => {
  try {
    const res = await axiosInstance.get("/api/appeals");
    return res.data.appeals || res.data || [];
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch appeals"
    );
  }
};

/**
 * Review an appeal (admin only)
 */
export const reviewAppeal = async (
  appealId: string,
  data: ReviewAppealInput
): Promise<Appeal> => {
  try {
    const res = await axiosInstance.patch(
      `/api/appeals/${appealId}/review`,
      data
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to review appeal"
    );
  }
};
