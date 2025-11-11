import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createReport,
  getMyReports,
  getAllReports,
  getUserReports,
  getUserReportStats,
  resolveReport,
  getModeratedUsers,
  getPendingReviewUsers,
  getUserModerationDetails,
  suspendUser,
  unsuspendUser,
  banUser,
  unbanUser,
  processExpiredSuspensions,
  createAppeal,
  getMyAppeals,
  getAppealById,
  getAllAppeals,
  reviewAppeal,
} from "@/services/moderation.service";
import {
  CreateReportInput,
  CreateAppealInput,
  ReviewAppealInput,
  SuspendUserInput,
  BanUserInput,
} from "@/types/moderation";

// ==================== REPORTS ====================

/**
 * Create a report
 */
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateReportInput) => createReport(data),
    onSuccess: () => {
      toast.success("Report submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["userReports"] });
      queryClient.invalidateQueries({ queryKey: ["flagusermoderation"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit report");
    },
  });

  return {
    ...mutation,
    createReportAsync: async (data: CreateReportInput) => {
      return mutation.mutateAsync(data);
    },
  };
};

/**
 * Get current user's reports
 */
export const useMyReports = () => {
  return useQuery({
    queryKey: ["reports", "me"],
    queryFn: () => getMyReports(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get all reports (admin only)
 */
export const useAllReports = () => {
  return useQuery({
    queryKey: ["reports", "all"],
    queryFn: () => getAllReports(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get reports for a specific user (admin only)
 */
export const useUserReports = (userId: string) => {
  return useQuery({
    queryKey: ["userReports", userId],
    queryFn: () => getUserReports(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get report statistics for a user (admin only, or for current user)
 */
export const useUserReportStats = (
  userId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["userReportStats", userId],
    queryFn: () => getUserReportStats(userId),
    enabled: options?.enabled !== false && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Resolve a report (admin only)
 */
export const useResolveReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      resolutionNotes,
    }: {
      reportId: string;
      resolutionNotes?: string;
    }) => resolveReport(reportId, resolutionNotes),
    onSuccess: () => {
      toast.success("Report resolved successfully");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["userReports"] });
      queryClient.invalidateQueries({ queryKey: ["flagusermoderation"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to resolve report");
    },
  });
};

// ==================== MODERATION ====================

/**
 * Get all moderated users (admin only)
 */
export const useModeratedUsers = () => {
  return useQuery({
    queryKey: ["flagusermoderation", "users"],
    queryFn: () => getModeratedUsers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get users pending review (admin only)
 */
export const usePendingReviewUsers = () => {
  return useQuery({
    queryKey: ["flagusermoderation", "pending-review"],
    queryFn: () => getPendingReviewUsers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get user moderation details (admin only, or for current user)
 */
export const useUserModerationDetails = (
  userId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["flagusermoderation", "user", userId],
    queryFn: () => getUserModerationDetails(userId),
    enabled: options?.enabled !== false && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Suspend a user (admin only)
 */
export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data?: SuspendUserInput;
    }) => suspendUser(userId, data),
    onSuccess: (_, variables) => {
      toast.success("User suspended successfully");
      queryClient.invalidateQueries({ queryKey: ["flagusermoderation"] });
      queryClient.invalidateQueries({
        queryKey: ["flagusermoderation", "user", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to suspend user");
    },
  });

  return {
    ...mutation,
    suspendUserAsync: async (userId: string, data?: SuspendUserInput) => {
      return mutation.mutateAsync({ userId, data });
    },
  };
};

/**
 * Unsuspend a user (admin only)
 */
export const useUnsuspendUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userId: string) => unsuspendUser(userId),
    onSuccess: (_, userId) => {
      toast.success("User unsuspended successfully");
      queryClient.invalidateQueries({ queryKey: ["flagusermoderation"] });
      queryClient.invalidateQueries({
        queryKey: ["flagusermoderation", "user", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unsuspend user");
    },
  });

  return {
    ...mutation,
    unsuspendUserAsync: async (userId: string) => {
      return mutation.mutateAsync(userId);
    },
  };
};

/**
 * Ban a user (admin only)
 */
export const useBanUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: BanUserInput }) =>
      banUser(userId, data),
    onSuccess: (_, variables) => {
      toast.success("User banned successfully");
      queryClient.invalidateQueries({ queryKey: ["flagusermoderation"] });
      queryClient.invalidateQueries({
        queryKey: ["flagusermoderation", "user", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to ban user");
    },
  });

  return {
    ...mutation,
    banUserAsync: async (userId: string, data: BanUserInput) => {
      return mutation.mutateAsync({ userId, data });
    },
  };
};

/**
 * Unban a user (admin only)
 */
export const useUnbanUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userId: string) => unbanUser(userId),
    onSuccess: (_, userId) => {
      toast.success("User unbanned successfully");
      queryClient.invalidateQueries({ queryKey: ["flagusermoderation"] });
      queryClient.invalidateQueries({
        queryKey: ["flagusermoderation", "user", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unban user");
    },
  });

  return {
    ...mutation,
    unbanUserAsync: async (userId: string) => {
      return mutation.mutateAsync(userId);
    },
  };
};

/**
 * Process expired suspensions (admin only)
 */
export const useProcessExpiredSuspensions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => processExpiredSuspensions(),
    onSuccess: (data: { processed: number }) => {
      toast.success(`Processed ${data.processed} expired suspensions`);
      queryClient.invalidateQueries({ queryKey: ["flagusermoderation"] });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to process expired suspensions");
    },
  });
};

// ==================== APPEALS ====================

/**
 * Create an appeal
 */
export const useCreateAppeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppealInput) => createAppeal(data),
    onSuccess: () => {
      toast.success("Appeal submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["appeals"] });
      queryClient.invalidateQueries({ queryKey: ["flagusermoderation"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit appeal");
    },
  });
};

/**
 * Get current user's appeals
 */
export const useMyAppeals = () => {
  return useQuery({
    queryKey: ["appeals", "me"],
    queryFn: () => getMyAppeals(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get appeal by ID
 */
export const useAppealById = (appealId: string) => {
  return useQuery({
    queryKey: ["appeals", appealId],
    queryFn: () => getAppealById(appealId),
    enabled: !!appealId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get all appeals (admin only)
 */
export const useAllAppeals = () => {
  return useQuery({
    queryKey: ["appeals", "all"],
    queryFn: () => getAllAppeals(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Review an appeal (admin only)
 */
export const useReviewAppeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appealId,
      data,
    }: {
      appealId: string;
      data: ReviewAppealInput;
    }) => reviewAppeal(appealId, data),
    onSuccess: (_, variables) => {
      toast.success(
        `Appeal ${
          variables.data.status === "accepted" ? "accepted" : "rejected"
        }`
      );
      queryClient.invalidateQueries({ queryKey: ["appeals"] });
      queryClient.invalidateQueries({ queryKey: ["flagusermoderation"] });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to review appeal");
    },
  });
};
