import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllReadNotifications,
} from "@/services/notification.service";
import { Notification, NotificationFilters } from "@/types/notification.type";
import toast from "react-hot-toast";

/**
 * Hook to fetch notifications with filters
 */
export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: () => getNotifications(filters),
    staleTime: 60000, // 1 minute - data is fresh for 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Disable to prevent burst on focus
    refetchOnReconnect: false, // Disable to prevent burst on reconnect
    refetchOnMount: true, // Only refetch when component mounts
    retry: 2, // Retry only 2 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

/**
 * Hook to get unread notification count
 * Note: This is primarily updated via Socket.IO, so we don't need aggressive polling
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
    staleTime: 120000, // 2 minutes - data is fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache
    refetchInterval: false, // Disable polling - rely on Socket.IO for real-time updates
    refetchOnWindowFocus: false, // Disable to prevent burst on focus
    refetchOnReconnect: false, // Disable to prevent burst on reconnect
    refetchOnMount: true, // Only refetch when component mounts
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to mark a notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark notification as read");
    },
  });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
      toast.success("All notifications marked as read");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark all as read");
    },
  });
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete notification");
    },
  });
}

/**
 * Hook to delete all read notifications
 */
export function useDeleteAllReadNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllReadNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
      toast.success("All read notifications deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete read notifications");
    },
  });
}
