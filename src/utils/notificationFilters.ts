import { NotificationType, Notification } from "@/types/notification.type";

// Admin notification types
export const ADMIN_NOTIFICATION_TYPES: NotificationType[] = [
  "admin_moderation_warning",
  "admin_moderation_suspension",
  "admin_moderation_ban",
  "admin_moderation_pending_review",
  "admin_user_dormant",
  "admin_user_disabled",
  "admin_payment_failed",
  "admin_subscription_expired",
  "admin_support_ticket",
  "admin_domain_verification",
  "admin_system_error",
  "admin_user_registered",
  "support_message_admin", // Admin receives notification when user sends support message
];

// User notification types (non-admin)
export const USER_NOTIFICATION_TYPES: NotificationType[] = [
  "post_created",
  "domain_post_created",
  "message_received",
  "payment_success",
  "payment_failed",
  "subscription_expired",
  "post_favorited",
  "post_graded",
  "grade_updated",
  "post_commented",
  "comment_replied",
  "system_announcement",
  "support_message_received", // User receives notification when admin replies
  "group_member_added", // User receives notification when added to a group chat
  "group_message_received", // User receives notification when new message in group chat
];

/**
 * Check if a notification type is an admin notification
 */
export const isAdminNotification = (type: NotificationType): boolean => {
  return ADMIN_NOTIFICATION_TYPES.includes(type);
};

/**
 * Check if a notification type is a user notification
 */
export const isUserNotification = (type: NotificationType): boolean => {
  return USER_NOTIFICATION_TYPES.includes(type);
};

/**
 * Filter notifications by role
 * - SYSTEM_ADMIN: only admin notifications
 * - TEACHER: only user notifications
 */
export const filterNotificationsByRole = (
  notifications: Notification[],
  role: "SYSTEM_ADMIN" | "TEACHER"
): Notification[] => {
  if (role === "SYSTEM_ADMIN") {
    return notifications.filter((notification) =>
      isAdminNotification(notification.type)
    );
  }
  // For TEACHER role, only show user notifications
  return notifications.filter((notification) =>
    isUserNotification(notification.type)
  );
};
