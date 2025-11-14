"use client";

import { Bell } from "lucide-react";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";
import { motion } from "framer-motion";

interface NotificationBellProps {
  onClick: () => void;
  className?: string;
}

export default function NotificationBell({
  onClick,
  className = "",
}: NotificationBellProps) {
  const { data: unreadData, isLoading } = useUnreadNotificationCount();
  const unreadCount = unreadData?.count || 0;

  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      aria-label="Notifications"
    >
      <Bell size={22} className="text-gray-600" />
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </motion.span>
      )}
    </button>
  );
}
