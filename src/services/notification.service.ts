import { axiosInstance } from "@/lib/axiosInstance";
import {
  Notification,
  NotificationFilters,
  NotificationResponse,
  UnreadCountResponse,
} from "@/types/notification.type";

/**
 * Get all notifications with optional filters
 */
export const getNotifications = async (
  filters?: NotificationFilters
): Promise<NotificationResponse> => {
  try {
    const params = new URLSearchParams();
    if (filters?.read !== undefined) {
      params.append("read", filters.read.toString());
    }
    if (filters?.type) {
      params.append("type", filters.type);
    }
    if (filters?.page) {
      params.append("page", filters.page.toString());
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }

    const res = await axiosInstance.get(
      `/api/notifications?${params.toString()}`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch notifications"
    );
  }
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount =
  async (): Promise<UnreadCountResponse> => {
    try {
      const res = await axiosInstance.get("/api/notifications/unread-count");
      return res.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to fetch unread count"
      );
    }
  };

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  try {
    const res = await axiosInstance.patch(
      `/api/notifications/${notificationId}/read`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to mark notification as read"
    );
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await axiosInstance.patch("/api/notifications/read-all");
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to mark all notifications as read"
    );
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (
  notificationId: string
): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/notifications/${notificationId}`);
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to delete notification"
    );
  }
};

/**
 * Delete all read notifications
 */
export const deleteAllReadNotifications = async (): Promise<void> => {
  try {
    await axiosInstance.delete("/api/notifications/read/all");
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to delete read notifications"
    );
  }
};
