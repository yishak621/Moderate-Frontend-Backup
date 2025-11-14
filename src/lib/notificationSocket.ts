import { io, Socket } from "socket.io-client";
import { getToken } from "@/services/tokenService";

/**
 * Get notification socket URL
 */
export const getNotificationSocketUrl = (): string => {
  if (process.env.NODE_ENV === "development") {
    return (
      process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL ||
      "http://localhost:8000/api/notifications"
    );
  }

  if (process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL) {
    return process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    const baseUrl = apiUrl.replace(/\/$/, "");
    return `${baseUrl}/api/notifications`;
  }

  return "/api/notifications";
};

/**
 * Create and configure notification socket connection
 */
export const createNotificationSocket = (): Socket => {
  const token = getToken();

  const socket = io(getNotificationSocketUrl(), {
    auth: { token },
    transports: ["websocket"],
    autoConnect: false,
  });

  return socket;
};
