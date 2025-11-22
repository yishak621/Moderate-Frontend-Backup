// NotificationItem.tsx
import React from "react";
import StatusCircle from "../StatusCircleProps";
import { Notification } from "@/types/notification.type";

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

// Get status color from notification type
const getStatusColorFromType = (type: Notification["type"]): string => {
  if (type.startsWith("admin_")) {
    switch (type) {
      case "admin_moderation_warning":
        return "bg-yellow-500";
      case "admin_moderation_suspension":
        return "bg-orange-500";
      case "admin_moderation_ban":
        return "bg-red-500";
      case "admin_moderation_pending_review":
        return "bg-blue-500";
      case "admin_user_dormant":
        return "bg-gray-500";
      case "admin_user_disabled":
        return "bg-red-500";
      case "admin_payment_failed":
      case "admin_subscription_expired":
        return "bg-red-500";
      case "admin_support_ticket":
        return "bg-purple-500";
      case "admin_domain_verification":
        return "bg-blue-500";
      case "admin_system_error":
        return "bg-red-500";
      case "admin_user_registered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  }
  return "bg-blue-500";
};

interface NotificationItemProps {
  // Legacy props for backward compatibility
  statusColor?: string;
  title?: string;
  time?: string;
  circleSize?: number;
  // New prop for Notification object
  notification?: Notification;
}

const DashboardNotificationItem: React.FC<NotificationItemProps> = ({
  statusColor,
  title,
  time,
  circleSize = 10,
  notification,
}) => {
  // If notification object is provided, use it; otherwise use legacy props
  const displayTitle = notification?.title || title || "";
  const displayTime = notification
    ? formatTimeAgo(notification.createdAt)
    : time || "";
  const displayColor =
    notification
      ? getStatusColorFromType(notification.type)
      : statusColor || "bg-red-600";

  return (
    <div className="flex flex-row gap-3 items-start ">
      <div className="flex justify-center items-center w-[25px] h-[25px]">
        <StatusCircle color={displayColor} size={circleSize} />
      </div>
      <div className="flex flex-col justify-start items-start gap-1.5">
        <p className="text-base font-normal text-[#0C0C0C]">{displayTitle}</p>
        <p className="text-[#717171] text-base font-medium">{displayTime}</p>
      </div>
    </div>
  );
};

export default DashboardNotificationItem;
