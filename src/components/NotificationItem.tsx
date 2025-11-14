"use client";

import { Notification } from "@/types/notification.type";
import {
  MessageSquare,
  FileText,
  Star,
  CreditCard,
  AlertCircle,
  Heart,
  CheckCircle2,
  XCircle,
  Bell,
  User,
  Calendar,
} from "lucide-react";
import { useMarkNotificationAsRead } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";

// Date formatting helper
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "message_received":
      return MessageSquare;
    case "post_created":
    case "domain_post_created":
      return FileText;
    case "post_favorited":
      return Heart;
    case "post_graded":
    case "grade_updated":
      return Star;
    case "post_commented":
    case "comment_replied":
      return MessageSquare;
    case "payment_success":
      return CheckCircle2;
    case "payment_failed":
    case "subscription_expired":
      return XCircle;
    case "system_announcement":
      return Bell;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "payment_success":
      return "bg-green-100 text-green-600";
    case "payment_failed":
    case "subscription_expired":
      return "bg-red-100 text-red-600";
    case "post_favorited":
      return "bg-pink-100 text-pink-600";
    case "post_graded":
    case "grade_updated":
      return "bg-blue-100 text-blue-600";
    case "message_received":
      return "bg-purple-100 text-purple-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const router = useRouter();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const Icon = getNotificationIcon(notification.type);
  const colorClass = getNotificationColor(notification.type);

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
      onMarkAsRead?.(notification.id);
    }

    if (notification.relatedPostId) {
      router.push(`/dashboard/teacher/grading/${notification.relatedPostId}`);
    } else if (notification.relatedMessageId) {
      router.push(
        `/dashboard/teacher/messages?chatId=${notification.relatedUserId}`
      );
    } else if (notification.type === "system_announcement") {
      router.push("/dashboard/teacher/announcements");
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(notification.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-start gap-3 p-4 cursor-pointer transition-colors
        ${notification.read ? "bg-white" : "bg-blue-50"}
        hover:bg-gray-50 border-b border-gray-100
      `}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
      >
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-semibold ${
                notification.read ? "text-gray-700" : "text-gray-900"
              }`}
            >
              {notification.title}
            </h4>
            <p
              className={`text-sm mt-1 ${
                notification.read ? "text-gray-500" : "text-gray-700"
              }`}
            >
              {notification.message}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <Calendar size={12} />
              <span>{formatTimeAgo(notification.createdAt)}</span>
            </div>
          </div>

          {!notification.read && (
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
          )}
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
        aria-label="Delete notification"
      >
        <XCircle size={16} className="text-gray-400" />
      </button>
    </div>
  );
}
