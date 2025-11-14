export type NotificationType =
  | "post_created"
  | "domain_post_created"
  | "message_received"
  | "payment_success"
  | "payment_failed"
  | "subscription_expired"
  | "post_favorited"
  | "post_graded"
  | "grade_updated"
  | "post_commented"
  | "comment_replied"
  | "system_announcement";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  relatedUserId?: string;
  relatedPostId?: string;
  relatedMessageId?: string;
  relatedSubscriptionId?: string;
  metadata?: Record<string, any>;
}

export interface NotificationFilters {
  read?: boolean;
  type?: NotificationType;
  page?: number;
  limit?: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UnreadCountResponse {
  count: number;
}
