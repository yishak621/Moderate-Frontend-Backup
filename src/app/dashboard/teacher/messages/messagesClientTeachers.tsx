"use client";

import { ThreadBox } from "@/modules/dashboard/teacher/ThreadBox";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  Brain,
  User,
  Loader2,
  MessageSquare,
  Send,
  Users,
  SmileIcon,
  RotateCcw,
  AlertCircle,
  UsersRound,
  AlertTriangle,
  X,
  LogOut,
  Trash2,
  Ban,
  UserCheck,
  ShieldOff,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import {
  useGetMessages,
  useMarkMessageAsRead,
  useSendMessageAPI,
  useThreads,
  useAllConversations,
  useGroupMessages,
  useLeaveGroup,
  useDeleteDirectChat,
  useBlockUser,
  useUnblockUser,
} from "@/hooks/useMessage";
import { useCreateGroupChat } from "@/hooks/useMessage";
import CreateGroupModal from "@/modules/dashboard/teacher/messages/CreateGroupModal";
import GroupMembersModal from "@/modules/dashboard/teacher/messages/GroupMembersModal";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
import { decoded } from "@/lib/currentUser";
import { Message, Thread, Threads } from "@/app/types/threads";
import { GroupMember } from "@/app/types/groupChat";
import EmojiPicker from "emoji-picker-react";
import { getToken } from "@/services/tokenService";
import { useSearchParams } from "next/navigation";
import { getSocketUrl } from "@/lib/socketConfig";
import Image from "next/image";
import MobileTabNavigation from "@/components/ui/MobileTabNavigation";
import MobileMessagesClient from "./MobileMessagesClient";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const tabs = [
  {
    id: "messages",
    label: "Messages",
    route: "/dashboard/teacher/messages",
  },
  {
    id: "announcements",
    label: "Announcements",
    route: "/dashboard/teacher/announcements",
  },
];

export default function MessagesClientTeachers() {
  const searchParams = useSearchParams();
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const token = getToken();

  const [newMessage, setNewMessage] = useState<string>("");
  const [messagesState, setMessagesState] = useState<Message[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [threadsState, setThreadsState] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<Threads | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState<boolean>(false);
  const sendingRef = useRef<boolean>(false);

  const userId: string = decoded?.id || "";
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [isGroupChat, setIsGroupChat] = useState<boolean>(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showGroupMembersModal, setShowGroupMembersModal] = useState(false);

  // Confirmation modal state
  type ConfirmationType =
    | "leaveGroup"
    | "deleteThread"
    | "blockUser"
    | "unblockUser"
    | null;
  const [confirmModal, setConfirmModal] = useState<{
    type: ConfirmationType;
    id: string;
    name: string;
  } | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const [chatId, setChatId] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef<boolean>(true);
  const userJustSentMessageRef = useRef<boolean>(false);
  const initialScrollDoneRef = useRef<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof window !== "undefined" ? new Audio("/audio/ping.mp3") : null
  );

  // HOOKS
  const { isThreadsLoading, isThreadsSuccess, threads } = useThreads(userId);
  const { conversations, isConversationsLoading } = useAllConversations();
  const { leaveGroupAsync, isLeavingGroup } = useLeaveGroup();
  const { deleteDirectChatAsync, isDeletingChat } = useDeleteDirectChat();
  const { blockUserAsync, isBlockingUser } = useBlockUser();
  const { unblockUserAsync, isUnblockingUser } = useUnblockUser();

  // Get messages - either direct or group
  const {
    isMessagesLoading: isDirectMessagesLoading,
    isMessagesSuccess: isDirectMessagesSuccess,
    messages: directMessages,
  } = useGetMessages(!isGroupChat ? activeId || "" : "");
  const {
    messages: groupMessages,
    isGroupMessagesLoading,
    isGroupMessagesSuccess,
  } = useGroupMessages(isGroupChat ? activeConversationId || "" : "");

  // Determine which messages to use
  const isMessagesLoading = isGroupChat
    ? isGroupMessagesLoading
    : isDirectMessagesLoading;
  const isMessagesSuccess = isGroupChat
    ? isGroupMessagesSuccess
    : isDirectMessagesSuccess;
  const messages = isGroupChat ? { messages: groupMessages } : directMessages;
  const { markMessageAsRead, markMessageAsReadAsync } = useMarkMessageAsRead();
  const {
    sendMessageAPIAsync,
    isSendMessageAPILoading,
    isSendMessageAPISuccess,
  } = useSendMessageAPI();

  // Build a lookup map of userId -> user info from conversations (for group chat sender names)
  const userLookup = useMemo(() => {
    const lookup = new Map<
      string,
      { name: string; profilePictureUrl?: string | null }
    >();

    // Add from conversations members
    if (conversations) {
      conversations.forEach((conv: { members?: GroupMember[] }) => {
        conv.members?.forEach((member: GroupMember) => {
          if (member.user && member.userId) {
            lookup.set(member.userId, {
              name: member.user.name,
              profilePictureUrl: member.user.profilePictureUrl,
            });
          }
        });
      });
    }

    // Add from direct message threads
    if (threads?.data) {
      threads.data.forEach((thread: Threads) => {
        if (thread.partnerId && thread.partnerName) {
          lookup.set(thread.partnerId, {
            name: thread.partnerName,
            profilePictureUrl: thread.partnerProfilePicture,
          });
        }
      });
    }

    return lookup;
  }, [conversations, threads?.data]);

  // Track previous thread to detect switches
  const prevThreadRef = useRef<{
    activeId: string | null;
    activeConversationId: string | null;
  }>({
    activeId: null,
    activeConversationId: null,
  });

  // Track local (optimistic) messages separately so they don't get lost
  const localMessagesRef = useRef<Message[]>([]);

  // Set messages when fetched - merge with existing local messages
  useEffect(() => {
    // Check if thread switched
    const threadSwitched =
      prevThreadRef.current.activeId !== activeId ||
      prevThreadRef.current.activeConversationId !== activeConversationId;

    // Update ref
    prevThreadRef.current = { activeId, activeConversationId };

    // If thread switched, clear local messages and reset scroll behavior
    if (threadSwitched) {
      localMessagesRef.current = [];
      isNearBottomRef.current = true;
      initialScrollDoneRef.current = false;
    }

    // Determine which messages to use based on chat type
    const currentMessages = isGroupChat
      ? groupMessages
      : directMessages?.messages;
    const currentSuccess = isGroupChat
      ? isGroupMessagesSuccess
      : isDirectMessagesSuccess;

    if (currentSuccess && currentMessages) {
      const apiMessages = currentMessages || [];

      // Filter local messages - remove confirmed ones
      const unconfirmedLocalMessages = localMessagesRef.current.filter((m) => {
        if (m.failed) return false;

        // Check if this local message has been confirmed in API
        const isConfirmed = apiMessages.some(
          (apiMsg: Message) =>
            apiMsg.id === m.id ||
            (apiMsg.content === m.content &&
              Math.abs(
                new Date(apiMsg.createdAt || "").getTime() -
                  new Date(m.createdAt || "").getTime()
              ) < 10000) // Within 10 seconds
        );
        return !isConfirmed;
      });

      // Update ref with remaining local messages
      localMessagesRef.current = unconfirmedLocalMessages;

      // Combine API messages with unconfirmed local messages
      const allMessages = [...apiMessages, ...unconfirmedLocalMessages].sort(
        (a, b) =>
          new Date(a.createdAt || "").getTime() -
          new Date(b.createdAt || "").getTime()
      );

      setMessagesState(allMessages);
    } else if (!activeId && !activeConversationId) {
      localMessagesRef.current = [];
      setMessagesState([]);
    }
  }, [
    isGroupChat,
    activeId,
    activeConversationId,
    groupMessages,
    directMessages,
    isGroupMessagesSuccess,
    isDirectMessagesSuccess,
  ]);

  // Use refs to access current state values in socket handlers
  const isGroupChatRef = useRef(isGroupChat);
  const activeConversationIdRef = useRef(activeConversationId);
  const activeIdRef = useRef(activeId);

  // Update refs when state changes
  useEffect(() => {
    isGroupChatRef.current = isGroupChat;
    activeConversationIdRef.current = activeConversationId;
    activeIdRef.current = activeId;
  }, [isGroupChat, activeConversationId, activeId]);

  // Initialize socket - only once
  useEffect(() => {
    if (!token || !userId) return;

    // Don't recreate socket if it already exists and is connected
    if (socketRef.current?.connected) {
      return;
    }

    const socket = io(getSocketUrl(), {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // Wait for connection before emitting
    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
      socket.emit("user:online", { userId });
    });

    socket.on("user:online", ({ userId }) => {
      console.log(`${userId} is online`);
    });

    socket.on("user:offline", ({ userId, lastSeen }) => {
      console.log(`${userId} went offline at ${lastSeen}`);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("Socket connection error:", err.message);
    });

    const handleNewMessage = (
      message: Message & { conversationId?: string }
    ) => {
      // ensure message has a createdAt timestamp
      const normalizedMessage = {
        ...message,
        createdAt: message.createdAt ?? new Date().toISOString(),
      };

      // Use refs to get current values (don't use state directly in socket handlers)
      const currentIsGroupChat = isGroupChatRef.current;
      const currentActiveConversationId = activeConversationIdRef.current;
      const currentActiveId = activeIdRef.current;
      const currentUserId = userId;

      // Check if message is for current conversation (direct or group)
      const isForCurrentChat = currentIsGroupChat
        ? normalizedMessage.conversationId === currentActiveConversationId
        : normalizedMessage.senderId === currentActiveId ||
          normalizedMessage.receiverId === currentActiveId;

      if (isForCurrentChat) {
        // Update or append message, avoiding duplicates
        setMessagesState((prev) => {
          // Check if this message already exists (might be a local optimistic message being confirmed)
          const existingIndex = prev.findIndex(
            (m) =>
              m.id === normalizedMessage.id ||
              (m.id.startsWith("tmp_") &&
                m.content === normalizedMessage.content &&
                Math.abs(
                  new Date(m.createdAt || "").getTime() -
                    new Date(normalizedMessage.createdAt || "").getTime()
                ) < 5000) // Within 5 seconds
          );

          if (existingIndex >= 0) {
            // Replace local message with confirmed one
            const updated = [...prev];
            updated[existingIndex] = { ...normalizedMessage };
            // Also reset sending state if this was our message
            if (
              normalizedMessage.senderId === currentUserId &&
              sendingRef.current
            ) {
              setSending(false);
              sendingRef.current = false;
            }
            return updated.sort(
              (a, b) =>
                new Date(a.createdAt ?? "").getTime() -
                new Date(b.createdAt ?? "").getTime()
            );
          } else {
            // New message, append it
            return [...prev, normalizedMessage].sort(
              (a, b) =>
                new Date(a.createdAt ?? "").getTime() -
                new Date(b.createdAt ?? "").getTime()
            );
          }
        });
      } else {
        // update thread preview and unread count
        setThreadsState((prev) =>
          prev.map((t) =>
            t.partnerId === normalizedMessage.senderId
              ? { ...t, lastMessage: normalizedMessage.content }
              : t
          )
        );

        setUnreadCounts((prev) => ({
          ...prev,
          [normalizedMessage.senderId ||
          normalizedMessage.conversationId ||
          ""]:
            (prev[
              normalizedMessage.senderId ||
                normalizedMessage.conversationId ||
                ""
            ] || 0) + 1,
        }));
      }

      // play sound for received messages
      if (normalizedMessage.senderId !== currentUserId) {
        audioRef.current
          ?.play()
          .catch(() => console.warn("Audio play prevented"));
      }
    };

    socket.on("message:new", handleNewMessage);

    const handleMessageRead = ({
      senderId,
      readAt,
    }: {
      senderId: string;
      readAt: string;
    }) => {
      setMessagesState((prev) =>
        prev.map((m) => (m.senderId === senderId ? { ...m, readAt } : m))
      );
    };

    socket.on("message:read", handleMessageRead);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:read", handleMessageRead);
      socket.off("user:online");
      socket.off("user:offline");
      socket.off("connect");
      socket.off("connect_error");
      // Don't disconnect here - keep connection alive
    };
  }, [userId, token]); // Only depend on userId and token

  // Join/leave group conversation room
  useEffect(() => {
    if (!socketRef.current?.connected) return;

    if (isGroupChat && activeConversationId) {
      // Join group conversation room
      socketRef.current.emit("join:conversation", activeConversationId);
      console.log("Joined conversation:", activeConversationId);

      return () => {
        if (socketRef.current?.connected) {
          // Leave group conversation room
          socketRef.current.emit("leave:conversation", activeConversationId);
          console.log("Left conversation:", activeConversationId);
        }
      };
    }
  }, [isGroupChat, activeConversationId]);

  // Smart auto-scroll - only scroll to bottom when:
  // 1. Initial load of conversation (scroll once)
  // 2. User just sent a message
  // 3. New message arrives AND user is near bottom
  useEffect(() => {
    if (messagesState.length === 0) return;

    // Initial scroll when conversation loads
    if (!initialScrollDoneRef.current) {
      initialScrollDoneRef.current = true;
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 100);
      return;
    }

    // Scroll if user just sent a message
    if (userJustSentMessageRef.current) {
      userJustSentMessageRef.current = false;
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Only scroll for new incoming messages if user is near bottom
    if (isNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesState]);

  // Track scroll position to determine if user is near bottom
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Consider "near bottom" if within 150px of the bottom
    isNearBottomRef.current = distanceFromBottom < 150;
  };

  // Online users
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("users:online", (users: string[]) => {
      setOnlineUsers(new Set(users));
    });

    socketRef.current.on("user:online", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socketRef.current.on("user:offline", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    return () => {
      socketRef.current?.off("users:online");
      socketRef.current?.off("user:online");
      socketRef.current?.off("user:offline");
    };
  }, []);

  // Mark messages as read (for direct messages only - groups don't use this endpoint)
  useEffect(() => {
    if (!activeId || isGroupChat || !messagesState.length) return;

    const markAsRead = async () => {
      try {
        await markMessageAsReadAsync(activeId);
      } catch (err) {
        console.error(err);
      }
    };

    // Debounce mark as read to avoid excessive calls
    const timeoutId = setTimeout(markAsRead, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, isGroupChat, messagesState.length]); // Only mark as read when messages change

  // Sync sending state with ref
  useEffect(() => {
    sendingRef.current = sending;
  }, [sending]);

  // Send message via WebSocket
  async function sendMessage() {
    if (!newMessage.trim() || !socketRef.current) return;

    setSending(true);
    sendingRef.current = true;
    const tempId = `tmp_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    const content = newMessage;

    const optimisticMessage: Message = {
      id: tempId,
      senderId: userId,
      receiverId: isGroupChat ? undefined : activeId || undefined,
      content,
      createdAt: new Date().toISOString(),
    };

    // Add to local messages ref for persistence across re-renders
    localMessagesRef.current = [...localMessagesRef.current, optimisticMessage];

    // Mark that user just sent a message (for auto-scroll)
    userJustSentMessageRef.current = true;

    setMessagesState((prev) => [...prev, optimisticMessage]);

    setNewMessage("");

    // Prepare message payload based on chat type
    const messagePayload = isGroupChat
      ? { tempId, conversationId: activeConversationId, content }
      : { tempId, chatId, postId, receiverId: activeId, content };

    socketRef.current.emit(
      "message:send",
      messagePayload,
      (ack: { ok?: boolean; message?: Message; error?: string }) => {
        // Always reset sending state first
        setSending(false);
        sendingRef.current = false;

        if (!ack) {
          // Fallback to HTTP
          if (isGroupChat) {
            sendMessageAPIAsync({
              conversationId: activeConversationId!,
              content,
            } as any);
          } else {
            fallbackHttpSend({
              chatId,
              postId,
              receiverId: activeId!,
              content,
              tempId,
              sendMessageAPIAsync,
            });
          }
          return;
        }

        if (ack.ok && ack.message) {
          // Remove from local messages ref since it's confirmed
          localMessagesRef.current = localMessagesRef.current.filter(
            (m) => m.id !== tempId
          );
          setMessagesState((prev) =>
            prev.map((m) => (m.id === tempId ? { ...ack.message! } : m))
          );
        } else {
          // Mark as failed in ref
          localMessagesRef.current = localMessagesRef.current.map((m) =>
            m.id === tempId ? { ...m, failed: true } : m
          );
          setMessagesState((prev) =>
            prev.map((m) => (m.id === tempId ? { ...m, failed: true } : m))
          );
          console.error("send failed", ack.error);
          toast.error(ack?.error || "Failed to send message. Tap to retry.", {
            id: `send-error-${tempId}`,
          });
        }
      }
    );
  }

  // Fallback HTTP message send
  async function fallbackHttpSend({
    chatId,
    postId,
    receiverId,
    content,
    tempId,
    sendMessageAPIAsync,
    data,
  }: {
    chatId: string | null;
    postId: string | null;
    receiverId: string;
    content: string;
    tempId: string;
    data?: any;
    sendMessageAPIAsync: any;
  }) {
    try {
      setMessagesState((prev) =>
        prev.map((m) => (m.id === tempId ? data.message : m))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setSending(false);
    }
  }

  // Resend failed message
  function resendMessage(failedMessage: Message) {
    // Remove the failed message from ref and state
    localMessagesRef.current = localMessagesRef.current.filter(
      (m) => m.id !== failedMessage.id
    );
    setMessagesState((prev) => prev.filter((m) => m.id !== failedMessage.id));

    // Re-send it
    const tempId = `tmp_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    const content = failedMessage.content;

    const optimisticMessage: Message = {
      id: tempId,
      senderId: userId,
      receiverId: isGroupChat ? undefined : activeId || undefined,
      content,
      createdAt: new Date().toISOString(),
    };

    // Add to local messages ref
    localMessagesRef.current = [...localMessagesRef.current, optimisticMessage];

    // Mark that user just sent a message (for auto-scroll)
    userJustSentMessageRef.current = true;

    setMessagesState((prev) => [...prev, optimisticMessage]);

    const messagePayload = isGroupChat
      ? { tempId, conversationId: activeConversationId, content }
      : { tempId, chatId, postId, receiverId: activeId, content };

    socketRef.current?.emit(
      "message:send",
      messagePayload,
      (ack: { ok?: boolean; message?: Message; error?: string }) => {
        if (!ack || !ack.ok) {
          // Mark as failed in ref
          localMessagesRef.current = localMessagesRef.current.map((m) =>
            m.id === tempId ? { ...m, failed: true } : m
          );
          setMessagesState((prev) =>
            prev.map((m) => (m.id === tempId ? { ...m, failed: true } : m))
          );
          toast.error(ack?.error || "Failed to send message. Tap to retry.", {
            id: `resend-error-${tempId}`,
          });
        } else if (ack.message) {
          // Remove from local ref since confirmed
          localMessagesRef.current = localMessagesRef.current.filter(
            (m) => m.id !== tempId
          );
          setMessagesState((prev) =>
            prev.map((m) => (m.id === tempId ? { ...ack.message! } : m))
          );
        }
      }
    );
  }

  // Confirmation modal handlers
  const handleConfirmAction = async () => {
    if (!confirmModal) return;

    setIsConfirmLoading(true);
    try {
      switch (confirmModal.type) {
        case "leaveGroup":
          await leaveGroupAsync(confirmModal.id);
          toast.success(`You have left "${confirmModal.name}"`);
          if (activeConversationId === confirmModal.id) {
            setActiveConversationId(null);
            setIsGroupChat(false);
            setMessagesState([]);
          }
          break;

        case "deleteThread":
          const result = await deleteDirectChatAsync(confirmModal.id);
          toast.success(
            result?.message || `Deleted conversation with ${confirmModal.name}`
          );
          if (activeId === confirmModal.id) {
            setActiveId(null);
            setMessagesState([]);
          }
          break;

        case "blockUser":
          await blockUserAsync({ userId: confirmModal.id });
          toast.success(`${confirmModal.name} has been blocked`);
          if (activeId === confirmModal.id) {
            setActiveId(null);
            setMessagesState([]);
          }
          break;

        case "unblockUser":
          await unblockUserAsync(confirmModal.id);
          toast.success(`${confirmModal.name} has been unblocked`);
          break;
      }
      setConfirmModal(null);
    } catch (error: any) {
      const errorMessages = {
        leaveGroup: "Failed to leave group",
        deleteThread: "Failed to delete conversation",
        blockUser: "Failed to block user",
        unblockUser: "Failed to unblock user",
      };
      toast.error(
        error?.message || errorMessages[confirmModal.type || "deleteThread"]
      );
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const getConfirmModalContent = () => {
    if (!confirmModal) return null;

    const configs = {
      leaveGroup: {
        icon: LogOut,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        title: "Leave Group",
        message: (
          <>
            Are you sure you want to leave{" "}
            <span className="font-semibold text-gray-800">
              &quot;{confirmModal.name}&quot;
            </span>
            ? You will no longer receive messages from this group.
          </>
        ),
        confirmText: "Leave Group",
        confirmVariant: "red" as const,
      },
      deleteThread: {
        icon: Trash2,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        title: "Delete Conversation",
        message: (
          <>
            Are you sure you want to delete all messages with{" "}
            <span className="font-semibold text-gray-800">
              {confirmModal.name}
            </span>
            ? This action cannot be undone.
          </>
        ),
        confirmText: "Delete",
        confirmVariant: "red" as const,
      },
      blockUser: {
        icon: Ban,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        title: "Block User",
        message: (
          <>
            Are you sure you want to block{" "}
            <span className="font-semibold text-gray-800">
              {confirmModal.name}
            </span>
            ? They will not be able to send you messages anymore.
          </>
        ),
        confirmText: "Block",
        confirmVariant: "red" as const,
      },
      unblockUser: {
        icon: UserCheck,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        title: "Unblock User",
        message: (
          <>
            Are you sure you want to unblock{" "}
            <span className="font-semibold text-gray-800">
              {confirmModal.name}
            </span>
            ? They will be able to send you messages again.
          </>
        ),
        confirmText: "Unblock",
        confirmVariant: "primary" as const,
      },
    };

    return configs[confirmModal.type!];
  };

  // Handle URL params for deep linking - only when searchParams change
  const searchParamsString = searchParams.toString();
  useEffect(() => {
    const chatIdParam = searchParams.get("chatId");
    const conversationIdParam = searchParams.get("conversationId");

    if (conversationIdParam) {
      // Only update if different from current
      if (activeConversationId !== conversationIdParam) {
        setIsGroupChat(true);
        setActiveConversationId(conversationIdParam);
        setActiveId(null);
        setMessagesState([]);
      }
    } else if (chatIdParam && threads?.data) {
      // Only update if different from current
      if (activeId !== chatIdParam) {
        const existingThread = threads.data.find(
          (thread: Threads) => thread.partnerId === chatIdParam
        );
        if (existingThread) {
          setIsGroupChat(false);
          setActiveConversationId(null);
          setActiveId(existingThread.partnerId);
          setActiveThread(existingThread);
          setMessagesState([]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString]);

  // Sync activeThread whenever activeId changes
  useEffect(() => {
    if (!activeId || !threads?.data) {
      setActiveThread(null);
      return;
    }

    const selectedThread = threads.data.find(
      (thread: Threads) => thread.partnerId === activeId
    );

    if (selectedThread) {
      setActiveThread(selectedThread);
    }
  }, [activeId, threads?.data]);

  // Check if current conversation is blocked (for direct messages only)
  const isCurrentChatBlocked = !isGroupChat && activeThread?.isBlocked;
  const isCurrentChatBlockedByThem =
    !isGroupChat && activeThread?.isBlockedByThem;
  const cannotSendMessage = isCurrentChatBlocked || isCurrentChatBlockedByThem;

  console.log(activeThread, "activeThread");
  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden flex flex-col h-screen ">
        <MobileMessagesClient />
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-[25%_75%] gap-4 md:gap-6 h-screen">
          <div className="bg-[#FDFDFD] rounded-[22px] py-6 px-7 flex flex-col h-screen overflow-hidden">
            <div className="flex items-center justify-between mb-5 shrink-0">
              <h4 className="text-[#0C0C0C] text-xl font-medium">Inbox</h4>
              <Button
                variant="primary"
                onClick={() => setShowCreateGroupModal(true)}
                className="text-sm px-3 py-1.5 h-auto"
                icon={<Users size={16} />}
              >
                New Group
              </Button>
            </div>

            <div className="flex flex-col gap-3 h-screen overflow-y-scroll scrollbar-hide">
              {isThreadsLoading ? (
                <div className="flex flex-col gap-4 p-5">
                  {/* Header shimmer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary animate-pulse" />
                      <p className="text-sm text-muted-foreground">
                        Fetching threads...
                      </p>
                    </div>
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  </div>

                  {/* Thread boxes placeholder */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="group flex items-center justify-between rounded-xl bg-muted/30 dark:bg-gray-800 p-3 animate-pulse"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted/50 dark:bg-gray-700 flex items-center justify-center">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 w-28 rounded bg-muted/50 dark:bg-gray-700" />
                          <div className="h-2 w-40 rounded bg-muted/40 dark:bg-gray-600" />
                        </div>
                      </div>
                      <MessageSquare className="h-4 w-4 text-muted-foreground opacity-50" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Direct Messages */}
                  {threads?.data?.map((thread: Threads, idx: number) => (
                    <ThreadBox
                      chatId={thread?.partnerId}
                      key={`direct-${idx}`}
                      name={thread.partnerName}
                      unreadCount={thread.unreadCount}
                      lastMessage={thread.lastMessage}
                      isActive={!isGroupChat && activeId === thread.partnerId}
                      onSelect={(id) => {
                        if (activeId !== id) {
                          setIsGroupChat(false);
                          setActiveId(id);
                          setActiveConversationId(null);
                        }
                      }}
                      onDeleteThread={(chatId, userName) => {
                        setConfirmModal({
                          type: "deleteThread",
                          id: chatId,
                          name: userName,
                        });
                      }}
                      onBlockUser={(chatId, userName) => {
                        setConfirmModal({
                          type: "blockUser",
                          id: chatId,
                          name: userName,
                        });
                      }}
                      onUnblockUser={(chatId, userName) => {
                        setConfirmModal({
                          type: "unblockUser",
                          id: chatId,
                          name: userName,
                        });
                      }}
                      isBlocked={thread.isBlocked}
                      isBlockedByThem={thread.isBlockedByThem}
                      isOnline={onlineUsers.has(thread.partnerId)}
                      profilePictureUrl={thread?.partnerProfilePicture}
                      isGroup={false}
                    />
                  ))}

                  {/* Group Conversations */}
                  {conversations
                    ?.filter((conv: any) => conv.type === "group")
                    .map((group: any, idx: number) => (
                      <ThreadBox
                        conversationId={group.id}
                        key={`group-${idx}`}
                        name={group.name}
                        unreadCount={group.unreadCount || 0}
                        lastMessage={
                          group.lastMessage?.content ||
                          group.messages?.[0]?.content ||
                          "No messages yet"
                        }
                        isActive={
                          isGroupChat && activeConversationId === group.id
                        }
                        onSelect={(id) => {
                          if (activeConversationId !== id) {
                            setIsGroupChat(true);
                            setActiveConversationId(id);
                            setActiveId(null);
                          }
                        }}
                        onLeaveGroup={(conversationId) => {
                          setConfirmModal({
                            type: "leaveGroup",
                            id: conversationId,
                            name: group.name,
                          });
                        }}
                        isOnline={false}
                        isGroup={true}
                      />
                    ))}
                </>
              )}
            </div>
          </div>
          <div className="bg-[#fdfdfd] py-4.5 rounded-[40px] flex flex-col h-screen overflow-hidden">
            {/* top section */}
            <div className="flex flex-row pb-3 px-6 items-center justify-between border-b border-b-[#DBDBDB]">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-[52px] h-[52px] rounded-full flex items-center justify-center relative ${
                    cannotSendMessage ? "bg-gray-400" : "bg-[#368FFF]"
                  }`}
                >
                  {isGroupChat ? (
                    <Users className="w-6 h-6 text-white" />
                  ) : cannotSendMessage ? (
                    <Ban className="w-6 h-6 text-white" />
                  ) : (
                    <MessageSquare className="w-6 h-6 text-white" />
                  )}
                  {cannotSendMessage && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                {isMessagesSuccess && (
                  <div className="flex flex-col">
                    <p className="text-xl text-[#0c0c0c] font-medium">
                      {isGroupChat
                        ? conversations?.find(
                            (conv: any) => conv.id === activeConversationId
                          )?.name || "Group Chat"
                        : `Chat with ${
                            threads?.data.find(
                              (thread: Threads) => thread.partnerId === activeId
                            )?.partnerName || ""
                          }`}
                    </p>
                    {/* Blocked Status Indicator */}
                    {cannotSendMessage && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Ban className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-xs text-red-500 font-medium">
                          {isCurrentChatBlocked ? "Blocked" : "Cannot message"}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* View Members Button - Only for group chats */}
              {isGroupChat && activeConversationId && (
                <button
                  onClick={() => setShowGroupMembersModal(true)}
                  className="flex items-center gap-2 px-4 py-2 mr-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  <UsersRound className="w-5 h-5" />
                  <span className="hidden sm:inline">Members</span>
                </button>
              )}
            </div>

            {/* Chat messages area */}

            <div className="flex-1 min-h-0 p-6 flex flex-col justify-end">
              {/* Scroll container */}
              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex flex-col gap-2 overflow-y-scroll max-h-full scrollbar-hide px-4"
              >
                {isMessagesLoading ? (
                  <MessagesLoading />
                ) : messagesState?.length ? (
                  messagesState?.map(
                    (message: Message & { conversationId?: string }) => {
                      const isSender = message.senderId === userId;

                      // Look up sender info from multiple sources
                      const lookupUser = message.senderId
                        ? userLookup.get(message.senderId)
                        : null;
                      const senderName =
                        message.sender?.name ||
                        lookupUser?.name ||
                        activeThread?.partnerName ||
                        "User";
                      const senderProfilePic =
                        message.sender?.profilePictureUrl ||
                        lookupUser?.profilePictureUrl ||
                        activeThread?.partnerProfilePicture;

                      return (
                        <div key={message.id} className="flex items-end gap-2">
                          {!isSender &&
                            (senderProfilePic ? (
                              <Image
                                src={senderProfilePic}
                                alt={senderName}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover border-2 border-[#368FFF]"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#368FFF] flex items-center justify-center text-white font-semibold text-sm border-2 border-[#368FFF]">
                                {senderName.charAt(0).toUpperCase()}
                              </div>
                            ))}
                          <div
                            className={`max-w-[70%] p-3 my-1 rounded-xl relative wrap-break-word ${
                              isSender
                                ? message.failed
                                  ? "bg-red-400 text-white self-end ml-auto"
                                  : "bg-blue-500 text-white self-end ml-auto"
                                : "bg-gray-200 text-black self-start mr-auto"
                            }`}
                          >
                            <div
                              className={`absolute w-3 h-3 bg-inherit transform rotate-45 ${
                                isSender
                                  ? "bottom-0 right-[-6px]"
                                  : "bottom-0 left-[-6px]"
                              }`}
                            />
                            {message.content}
                            <div className="flex items-center justify-between mt-1  mr-2">
                              {!isSender && isGroupChat && (
                                <span className="text-[10px] text-gray-600 font-medium mr-3">
                                  {senderName}
                                </span>
                              )}
                              <div className="flex items-center gap-1">
                                <span
                                  className={`text-[10px] ${
                                    isSender ? "text-white/80" : "text-gray-600"
                                  } text-right`}
                                >
                                  {new Date(
                                    message.createdAt ?? Date.now()
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Failed message indicator with resend */}
                          {message.failed && isSender && (
                            <button
                              onClick={() => resendMessage(message)}
                              className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors ml-1"
                              title="Tap to resend"
                            >
                              <AlertCircle className="w-4 h-4" />
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      );
                    }
                  )
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    Chat room – Messages will appear here
                  </div>
                )}
              </div>
            </div>

            {/* chat input */}
            <div className="px-6 py-4">
              {cannotSendMessage ? (
                /* Blocked Message Banner */
                <div className="flex items-center justify-center gap-3 py-4 px-6 bg-gray-100 border border-gray-200 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {isCurrentChatBlocked ? (
                      <Ban className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ShieldOff className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 font-medium text-sm">
                      {isCurrentChatBlocked
                        ? "You blocked this user"
                        : "You cannot reply to this conversation"}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {isCurrentChatBlocked
                        ? "Unblock them to send messages"
                        : "This user has restricted who can message them"}
                    </p>
                  </div>
                  {isCurrentChatBlocked && (
                    <button
                      onClick={() => {
                        if (activeThread) {
                          setConfirmModal({
                            type: "unblockUser",
                            id: activeThread.partnerId,
                            name: activeThread.partnerName,
                          });
                        }
                      }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Unblock
                    </button>
                  )}
                </div>
              ) : (
                /* Normal Input */
                <div className="flex gap-3 items-start ">
                  <div className="flex-1 ">
                    <div className="relative flex flex-row items-center">
                      {/* Emoji picker dropdown */}
                      {showPicker && (
                        <div className="absolute bottom-14 left-0">
                          <EmojiPicker
                            onEmojiClick={(emojiObject) =>
                              setNewMessage((prev) => prev + emojiObject.emoji)
                            }
                          />
                        </div>
                      )}
                      <div className="relative w-full">
                        {/* Emoji toggle button */}
                        <button
                          type="button"
                          onClick={() => setShowPicker((prev) => !prev)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition"
                        >
                          <SmileIcon size={22} className="text-gray-500" />
                        </button>

                        {/* Message input */}
                        <textarea
                          ref={inputRef}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          placeholder="Type your message..."
                          className="w-full pl-14 pr-3 py-2 pt-2.5 border border-[#DBDBDB] rounded-lg resize-none focus:outline-none focus:border-[#368FFF] h-[50px] leading-6"
                          rows={1}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={
                      !newMessage.trim() || (!activeId && !activeConversationId)
                    }
                    className="bg-[#368FFF] hover:bg-[#2574db] disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200 flex items-center justify-center w-[50px] h-[50px]"
                  >
                    <Send size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      <ResponsiveModal
        isOpen={showCreateGroupModal}
        onOpenChange={setShowCreateGroupModal}
      >
        <CreateGroupModal />
      </ResponsiveModal>

      {/* Group Members Modal */}
      {activeConversationId && (
        <GroupMembersModal
          isOpen={showGroupMembersModal}
          onClose={() => setShowGroupMembersModal(false)}
          conversationId={activeConversationId}
        />
      )}

      {/* Confirmation Modal for Leave Group / Delete Thread / Block User */}
      <AnimatePresence>
        {confirmModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isConfirmLoading && setConfirmModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                {(() => {
                  const config = getConfirmModalContent();
                  if (!config) return null;
                  const IconComponent = config.icon;

                  return (
                    <>
                      {/* Header with Icon */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center flex-shrink-0`}
                        >
                          <IconComponent
                            className={`w-6 h-6 ${config.iconColor}`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {config.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{config.message}</p>
                        </div>
                        <button
                          onClick={() =>
                            !isConfirmLoading && setConfirmModal(null)
                          }
                          disabled={isConfirmLoading}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-6">
                        <Button
                          variant="secondary"
                          className="flex-1"
                          onClick={() => setConfirmModal(null)}
                          disabled={isConfirmLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant={config.confirmVariant}
                          className="flex-1"
                          onClick={handleConfirmAction}
                          disabled={isConfirmLoading}
                        >
                          {isConfirmLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </span>
                          ) : (
                            config.confirmText
                          )}
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MessagesLoading() {
  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto">
      {/* Header / optional notice */}
      <div className="flex justify-center items-center gap-2 text-gray-400 text-sm">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>Loading messages...</span>
      </div>

      {/* Placeholder messages */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`flex overflow-hidden ${
            i % 2 === 0 ? "justify-start" : "justify-end"
          } animate-pulse`}
        >
          <div
            className={`max-w-[60%] rounded-xl p-3 ${
              i % 2 === 0
                ? "bg-gray-200 dark:bg-gray-700"
                : "bg-[#368FFF] text-white"
            }`}
          >
            <div className="h-3 w-32 rounded bg-gray-300 dark:bg-gray-600 mb-1"></div>
            <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
