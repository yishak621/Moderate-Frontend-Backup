"use client";

import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { getSocketUrl } from "@/lib/socketConfig";
import { getToken } from "@/services/tokenService";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "@/app/types/threads";

interface UseMessageSocketProps {
  userId?: string;
  enabled?: boolean;
}

/**
 * Hook to manage real-time message socket connection
 */
export function useMessageSocket({
  userId,
  enabled = true,
}: UseMessageSocketProps = {}) {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !userId) return;

    const token = getToken();
    if (!token) return;

    // Create socket connection using the same URL as messages
    const socket = io(getSocketUrl(), {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
    });

    socketRef.current = socket;

    // Emit user online
    socket.emit("user:online", { userId });

    // Listen for new messages
    socket.on("message:new", (message: Message) => {
      // Invalidate threads query to refetch and update unread counts
      queryClient.invalidateQueries({ queryKey: ["threads", userId] });
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    });

    // Handle connection events
    socket.on("connect", () => {
      console.log("Message socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Message socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Message socket connection error:", error);
    });

    // Cleanup on unmount
    return () => {
      socket.off("message:new");
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

