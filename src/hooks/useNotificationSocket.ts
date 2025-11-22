"use client";

import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { createNotificationSocket } from "@/lib/notificationSocket";
import { Notification } from "@/types/notification.type";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getRole } from "@/services/tokenService";
import {
  isAdminNotification,
  isUserNotification,
} from "@/utils/notificationFilters";

interface UseNotificationSocketProps {
  userId?: string;
  enabled?: boolean;
}

/**
 * Hook to manage real-time notification socket connection
 */
export function useNotificationSocket({
  userId,
  enabled = true,
}: UseNotificationSocketProps = {}) {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !userId) return;

    // Get user role
    const role = getRole() as "SYSTEM_ADMIN" | "TEACHER" | null;

    // Create socket connection
    const socket = createNotificationSocket();
    socketRef.current = socket;

    // Connect to socket
    socket.connect();

    // Join user's notification room
    socket.emit("join", { userId });

    // Listen for new notifications
    socket.on("notification:new", (notification: Notification) => {
      // Filter notifications based on role
      if (role === "SYSTEM_ADMIN") {
        // System admins should only receive admin notifications
        if (!isAdminNotification(notification.type)) {
          return; // Ignore user notifications for system admins
        }
      } else if (role === "TEACHER") {
        // Teachers should only receive user notifications
        if (!isUserNotification(notification.type)) {
          return; // Ignore admin notifications for teachers
        }
      }

      // Invalidate queries to refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });

      // Show toast notification
      toast.success(
        `${notification.title}${
          notification.message ? `: ${notification.message}` : ""
        }`,
        {
          duration: 5000,
          icon: "🔔",
        }
      );
    });

    // Handle connection events
    socket.on("connect", () => {
      console.log("Notification socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Notification socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Notification socket connection error:", error);
    });

    // Cleanup on unmount
    return () => {
      socket.off("notification:new");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, userId, queryClient]);

  return {
    socket: socketRef.current,
  };
}
