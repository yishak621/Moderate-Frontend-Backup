"use client";

import { useState, useEffect, ReactNode, useMemo } from "react";
import NotificationBell from "./NotificationBell";
import NotificationPanel from "./NotificationPanel";
import MobileNotificationPanel from "./MobileNotificationPanel";
import { useUserData } from "@/hooks/useUser";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { useNotifications } from "@/hooks/useNotifications";
import { motion } from "framer-motion";
import { getRole } from "@/services/tokenService";
import { filterNotificationsByRole } from "@/utils/notificationFilters";

interface NotificationBellWithPanelProps {
  customIcon?: ReactNode;
  showBackdrop?: boolean;
}

export default function NotificationBellWithPanel({
  customIcon,
  showBackdrop = true,
}: NotificationBellWithPanelProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useUserData();
  const role = getRole() as "SYSTEM_ADMIN" | "TEACHER" | null;

  // Only fetch unread notifications for count - limit to 50 to reduce payload
  const { data: notificationsData } = useNotifications({
    read: false,
    limit: 50, // Reduced from 100 - we only need count, not all notifications
  });

  // Filter notifications by role
  const filteredNotifications = useMemo(() => {
    if (!notificationsData?.notifications || !role) return [];
    return filterNotificationsByRole(notificationsData.notifications, role);
  }, [notificationsData?.notifications, role]);

  const unreadCount = filteredNotifications.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useNotificationSocket({
    userId: user?.id,
    enabled: !!user?.id,
  });

  return (
    <>
      {customIcon ? (
        <div
          onClick={() => setIsPanelOpen(true)}
          className="relative inline-block"
        >
          {customIcon}
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-0 right-0 bg-[#368FFF] text-white text-[10px] sm:text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg z-50 pointer-events-none border-2 border-white"
              style={{ transform: "translate(30%, -30%)" }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </div>
      ) : (
        <NotificationBell onClick={() => setIsPanelOpen(true)} />
      )}
      {isMobile ? (
        <MobileNotificationPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
        />
      ) : (
        <NotificationPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          showBackdrop={showBackdrop}
        />
      )}
    </>
  );
}
