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
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to get unread notification count
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
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
