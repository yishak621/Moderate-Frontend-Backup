"use client";

import { useEffect, useRef, useState } from "react";
import { X, CheckCheck, Trash2, BellOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useNotifications,
  useMarkAllNotificationsAsRead,
  useDeleteAllReadNotifications,
  useDeleteNotification,
} from "@/hooks/useNotifications";
import NotificationItem from "./NotificationItem";
import { Notification } from "@/types/notification.type";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  showBackdrop?: boolean;
}

export default function NotificationPanel({
  isOpen,
  onClose,
  showBackdrop = true,
}: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data, isLoading, refetch } = useNotifications({
    read: filter === "unread" ? false : undefined,
    limit: 20,
  });

  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: deleteAllRead } = useDeleteAllReadNotifications();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = data?.notifications || [];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

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
        <>
          {/* Backdrop */}
          {showBackdrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={onClose}
            />
          )}

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-16 md:top-20 w-[90vw] sm:w-96 max-w-md bg-white rounded-xl shadow-2xl z-50 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === "unread"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Unread
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 p-3 border-b border-gray-200">
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCheck size={16} />
                Mark all read
              </button>
              <button
                onClick={handleDeleteAllRead}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Clear read
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <BellOff size={48} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">
                    {filter === "unread"
                      ? "No unread notifications"
                      : "No notifications"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
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
        </>
      )}
    </AnimatePresence>
  );
}
