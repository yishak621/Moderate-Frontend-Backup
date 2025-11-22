"use client";

import { useEffect, useState, useMemo } from "react";
import { X, CheckCheck, Trash2, BellOff, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useNotifications,
  useMarkAllNotificationsAsRead,
  useDeleteAllReadNotifications,
  useDeleteNotification,
} from "@/hooks/useNotifications";
import NotificationItem from "./NotificationItem";
import { getRole } from "@/services/tokenService";
import { filterNotificationsByRole } from "@/utils/notificationFilters";

interface MobileNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNotificationPanel({
  isOpen,
  onClose,
}: MobileNotificationPanelProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const role = getRole() as "SYSTEM_ADMIN" | "TEACHER" | null;

  const { data, isLoading, refetch } = useNotifications({
    read: filter === "unread" ? false : undefined,
    limit: 50,
  });

  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: deleteAllRead } = useDeleteAllReadNotifications();
  const { mutate: deleteNotification } = useDeleteNotification();

  // Filter notifications by role
  const notifications = useMemo(() => {
    if (!data?.notifications || !role) return [];
    return filterNotificationsByRole(data.notifications, role);
  }, [data?.notifications, role]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDeleteAllRead = () => {
    deleteAllRead();
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-0 bg-white z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                filter === "unread"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Unread
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-white">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200"
            >
              <CheckCheck size={18} />
              Mark all read
            </button>
            <button
              onClick={handleDeleteAllRead}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
            >
              <Trash2 size={18} />
              Clear read
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <BellOff size={64} className="text-gray-300 mb-4" />
                <p className="text-gray-500 text-base font-medium">
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications"}
                </p>
                <p className="text-gray-400 text-sm mt-1 text-center">
                  {filter === "unread"
                    ? "You're all caught up!"
                    : "You'll see notifications here when you receive them"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
