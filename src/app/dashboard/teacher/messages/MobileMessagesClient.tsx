"use client";

import { ThreadBox } from "@/modules/dashboard/teacher/ThreadBox";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
  useGetGroupMembers,
  useAddGroupMembers,
  useRemoveGroupMember,
  useCreateGroupChat,
} from "@/hooks/useMessage";
import { useSearchUsers } from "@/hooks/useUser";
import BottomSheet from "@/components/ui/BottomSheet";
import UserProfileModal from "@/components/UserProfileModal";
import Button from "@/components/ui/Button";
import { decoded } from "@/lib/currentUser";
import { useForm } from "react-hook-form";
import { CreateGroupInput } from "@/app/types/groupChat";
import { User } from "@/app/types/user";
import { Message, Thread, Threads } from "@/app/types/threads";
import { getToken } from "@/services/tokenService";
import { getSocketUrl } from "@/lib/socketConfig";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import Image from "next/image";
import SectionLoading from "@/components/SectionLoading";
import { EmptyState } from "@/components/EmptyStateProps";
import MobileTabNavigation from "@/components/ui/MobileTabNavigation";
import {
  Loader2,
  Users,
  MessageSquare,
  Brain,
  X,
  LogOut,
  Trash2,
  Ban,
  UserCheck,
  UsersRound,
  Crown,
  UserPlus,
  UserMinus,
  Search,
  Shield,
  ShieldOff,
  Mail,
  Calendar,
  AlertTriangle,
  Check,
  ChevronRight,
} from "lucide-react";
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

export default function MobileMessagesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const token = getToken();

  const [newMessage, setNewMessage] = useState<string>("");
  const [messagesState, setMessagesState] = useState<Message[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [threadsState, setThreadsState] = useState<
    import("@/app/types/threads").Threads[]
  >([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState<boolean>(false);
  const sendingRef = useRef<boolean>(false);

  const userId: string = decoded?.id || "";
  const [activeId, setActiveId] = useState<string | null>(chatId);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [isGroupChat, setIsGroupChat] = useState<boolean>(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [createGroupSearchTerm, setCreateGroupSearchTerm] = useState("");
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<User[]>([]);

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof window !== "undefined" ? new Audio("/audio/ping.mp3") : null
  );

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

  // Mobile actions bottom sheet state
  type MobileAction = {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    className?: string;
  };
  const [mobileActionsSheet, setMobileActionsSheet] = useState<{
    actions: MobileAction[];
  } | null>(null);

  // Group members bottom sheet state
  const [showMembersSheet, setShowMembersSheet] = useState(false);
  const [showAddMemberSheet, setShowAddMemberSheet] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [addMemberSearchQuery, setAddMemberSearchQuery] = useState("");
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<any[]>([]);
  const [removeMemberConfirm, setRemoveMemberConfirm] = useState<{
    userId: string;
    userName: string;
  } | null>(null);

  // User profile modal state
  const [profileModalUserId, setProfileModalUserId] = useState<string | null>(
    null
  );

  // HOOKS
  const { isThreadsLoading, isThreadsSuccess, threads } = useThreads(userId);
  const { conversations, isConversationsLoading } = useAllConversations();
  const { leaveGroupAsync, isLeavingGroup } = useLeaveGroup();
  const { deleteDirectChatAsync, isDeletingChat } = useDeleteDirectChat();
  const { blockUserAsync, isBlockingUser } = useBlockUser();
  const { unblockUserAsync, isUnblockingUser } = useUnblockUser();
  const { createGroupChatAsync, isCreatingGroup } = useCreateGroupChat();

  // Form for create group
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGroupInput>();

  // Search users for create group
  const {
    users: createGroupUsers,
    isSearchingUsers: isSearchingCreateGroupUsers,
  } = useSearchUsers(1, 10, showCreateGroupModal ? createGroupSearchTerm : "");

  // Group members hooks - only fetch when viewing a group chat
  const {
    members: groupMembers,
    memberCount,
    groupName: fetchedGroupName,
    isOwner: isGroupOwner,
    isGroupMembersLoading,
    isGroupMembersError,
    refetchGroupMembers,
  } = useGetGroupMembers(
    showMembersSheet && activeConversationId ? activeConversationId : ""
  );
  const { addGroupMembersAsync, isAddingMembers } = useAddGroupMembers();
  const { removeGroupMemberAsync, isRemovingMember } = useRemoveGroupMember();
  const { users: searchedUsers, isSearchingUsers } = useSearchUsers(
    1,
    20,
    isGroupOwner && showAddMemberSheet ? addMemberSearchQuery : ""
  );

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

  // --- Group Members Helpers ---
  // Filter members by search
  const filteredMembers = useMemo(() => {
    if (!groupMembers) return [];
    return groupMembers.filter(
      (member: any) =>
        member.user?.name
          ?.toLowerCase()
          .includes(memberSearchQuery.toLowerCase()) ||
        member.user?.email
          ?.toLowerCase()
          .includes(memberSearchQuery.toLowerCase())
    );
  }, [groupMembers, memberSearchQuery]);

  // Get existing member IDs to exclude from add list
  const existingMemberIds = useMemo(() => {
    return new Set((groupMembers || []).map((m: any) => m.userId));
  }, [groupMembers]);

  // Filter available users for adding (not already in group)
  const availableUsersToAdd = useMemo(() => {
    if (!searchedUsers) return [];
    return searchedUsers.filter(
      (user: any) =>
        user.id !== userId &&
        !existingMemberIds.has(user.id) &&
        !selectedUsersToAdd.some((selected) => selected.id === user.id)
    );
  }, [searchedUsers, userId, existingMemberIds, selectedUsersToAdd]);

  // Format date for member joined date
  const formatMemberDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Toggle user selection for adding
  const toggleUserSelection = (user: any) => {
    setSelectedUsersToAdd((prev) => {
      if (prev.some((u) => u.id === user.id)) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  // Handle adding members
  const handleAddMembersSubmit = async () => {
    if (selectedUsersToAdd.length === 0 || !activeConversationId) {
      toast.error("Please select at least one member to add");
      return;
    }

    try {
      const memberIds = selectedUsersToAdd.map((u) => u.id);
      await addGroupMembersAsync({
        conversationId: activeConversationId,
        data: { memberIds },
      });
      toast.success(
        `${selectedUsersToAdd.length} member${
          selectedUsersToAdd.length > 1 ? "s" : ""
        } added successfully`
      );
      setSelectedUsersToAdd([]);
      setAddMemberSearchQuery("");
      setShowAddMemberSheet(false);
      refetchGroupMembers();
    } catch (error: any) {
      toast.error(error?.message || "Failed to add members");
    }
  };

  // Handle removing member
  const handleRemoveMemberSubmit = async () => {
    if (!removeMemberConfirm || !activeConversationId) return;

    try {
      await removeGroupMemberAsync({
        conversationId: activeConversationId,
        userId: removeMemberConfirm.userId,
      });
      toast.success(
        `${removeMemberConfirm.userName} has been removed from the group`
      );
      setRemoveMemberConfirm(null);
      refetchGroupMembers();
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove member");
    }
  };

  // Close add member sheet and reset state
  const closeAddMemberSheet = () => {
    setShowAddMemberSheet(false);
    setSelectedUsersToAdd([]);
    setAddMemberSearchQuery("");
  };

  // Filter available users for create group (not current user, not already selected)
  const availableCreateGroupUsers = useMemo(() => {
    if (!createGroupUsers) return [];
    return createGroupUsers.filter(
      (user: User) =>
        user.id !== userId &&
        !selectedGroupMembers.some((selected) => selected.id === user.id)
    );
  }, [createGroupUsers, userId, selectedGroupMembers]);

  // Toggle member selection for create group
  const toggleGroupMemberSelection = (user: User) => {
    setSelectedGroupMembers((prev) => {
      if (prev.some((m) => m.id === user.id)) {
        return prev.filter((m) => m.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  // Handle create group form submission
  const handleCreateGroup = async (data: CreateGroupInput) => {
    if (selectedGroupMembers.length < 2) {
      toast.error("Please select at least 2 members for the group");
      return;
    }

    try {
      const memberIds = selectedGroupMembers
        .map((member) => member.id || "")
        .filter(Boolean) as string[];
      const result = await createGroupChatAsync({
        name: data.name,
        memberIds,
      });

      if (result?.conversation) {
        toast.success("Group created successfully!");
        setShowCreateGroupModal(false);
        reset();
        setSelectedGroupMembers([]);
        setCreateGroupSearchTerm("");
        router.push(
          `/dashboard/teacher/messages?conversationId=${result.conversation.id}`
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to create group");
    }
  };

  // Close create group modal and reset
  const closeCreateGroupModal = () => {
    setShowCreateGroupModal(false);
    reset();
    setSelectedGroupMembers([]);
    setCreateGroupSearchTerm("");
  };

  // Set chatId/conversationId from URL params
  useEffect(() => {
    const chatIdParam = searchParams.get("chatId");
    const conversationIdParam = searchParams.get("conversationId");

    if (conversationIdParam && conversationIdParam !== activeConversationId) {
      setIsGroupChat(true);
      setActiveConversationId(conversationIdParam);
      setActiveId(null);
      setMessagesState([]);
    } else if (chatIdParam && chatIdParam !== activeId) {
      setIsGroupChat(false);
      setActiveConversationId(null);
      setActiveId(chatIdParam);
      setMessagesState([]);
    } else if (
      !chatIdParam &&
      !conversationIdParam &&
      (activeId || activeConversationId)
    ) {
      setActiveId(null);
      setActiveConversationId(null);
      setIsGroupChat(false);
      setMessagesState([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only depend on searchParams, not activeId/activeConversationId

  // Track last processed message count to prevent infinite loops
  const lastMessageCountRef = useRef<number>(0);
  const lastCurrentIdRef = useRef<string | null>(null);

  // Set messages when fetched - merge with existing pending messages
  useEffect(() => {
    const currentId = isGroupChat ? activeConversationId : activeId;

    // Only process if conversation changed or messages actually changed
    const messageCount = messages?.messages?.length || 0;
    const conversationChanged = currentId !== lastCurrentIdRef.current;
    const messagesChanged = messageCount !== lastMessageCountRef.current;

    if (
      isMessagesSuccess &&
      messages?.messages &&
      currentId &&
      (conversationChanged || messagesChanged)
    ) {
      const apiMessages = messages.messages || [];

      setMessagesState((prev) => {
        // Keep pending messages that haven't been confirmed yet
        const pendingMessages = prev.filter((m) => m.pending && !m.failed);

        // Merge API messages with pending messages, avoiding duplicates
        const existingIds = new Set(prev.map((m) => m.id));
        const newApiMessages = apiMessages.filter(
          (m: any) => !existingIds.has(m.id)
        );

        // If no new messages and no pending, don't update
        if (
          newApiMessages.length === 0 &&
          pendingMessages.length === 0 &&
          !conversationChanged
        ) {
          return prev;
        }

        // Combine and sort
        const allMessages = [...pendingMessages, ...newApiMessages].sort(
          (a, b) =>
            new Date(a.createdAt || "").getTime() -
            new Date(b.createdAt || "").getTime()
        );

        return allMessages;
      });

      // Update refs
      lastMessageCountRef.current = messageCount;
      lastCurrentIdRef.current = currentId;
    } else if (!currentId) {
      setMessagesState([]);
      lastMessageCountRef.current = 0;
      lastCurrentIdRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMessagesSuccess, activeId, activeConversationId, isGroupChat]); // Removed 'messages' from deps

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
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socket.on("user:offline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    const handleNewMessage = (
      message: Message & { conversationId?: string }
    ) => {
      // normalize createdAt like desktop
      const normalized = {
        ...message,
        createdAt: (message as any).createdAt ?? new Date().toISOString(),
      } as any;

      // Use refs to get current values
      const currentIsGroupChat = isGroupChatRef.current;
      const currentActiveConversationId = activeConversationIdRef.current;
      const currentActiveId = activeIdRef.current;
      const currentUserId = userId;

      // Check if message is for current conversation (direct or group)
      const isForCurrentChat = currentIsGroupChat
        ? normalized.conversationId === currentActiveConversationId
        : normalized.senderId === currentActiveId ||
          normalized.receiverId === currentActiveId;

      if (isForCurrentChat) {
        // Update or append message, avoiding duplicates
        setMessagesState((prev) => {
          // Check if this message already exists (might be a pending message being confirmed)
          const existingIndex = prev.findIndex(
            (m) =>
              m.id === normalized.id ||
              (m.pending &&
                m.content === normalized.content &&
                Math.abs(
                  new Date(m.createdAt || "").getTime() -
                    new Date(normalized.createdAt || "").getTime()
                ) < 5000) // Within 5 seconds
          );

          if (existingIndex >= 0) {
            // Replace pending message with confirmed one
            const updated = [...prev];
            updated[existingIndex] = { ...normalized, pending: false };
            // Also reset sending state if this was our message
            if (normalized.senderId === currentUserId && sendingRef.current) {
              setSending(false);
              sendingRef.current = false;
            }
            return updated.sort(
              (a: any, b: any) =>
                new Date(a.createdAt ?? "").getTime() -
                new Date(b.createdAt ?? "").getTime()
            );
          } else {
            // New message, append it
            return [...prev, normalized].sort(
              (a: any, b: any) =>
                new Date(a.createdAt ?? "").getTime() -
                new Date(b.createdAt ?? "").getTime()
            );
          }
        });
      } else {
        // update thread preview and unread count
        setThreadsState((prev) =>
          prev.map((t) =>
            t.partnerId === normalized.senderId
              ? { ...t, lastMessage: normalized.content }
              : t
          )
        );
        setUnreadCounts((prev) => ({
          ...prev,
          [normalized.senderId]: (prev[normalized.senderId] || 0) + 1,
        }));
      }

      if (normalized.senderId !== currentUserId) {
        audioRef.current?.play().catch(() => {});
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
      // Don't disconnect here - keep connection alive
    };
  }, [token, userId]); // Only depend on token and userId

  // Join/leave group conversation room
  useEffect(() => {
    if (!socketRef.current?.connected) return;

    if (isGroupChat && activeConversationId) {
      socketRef.current.emit("join:conversation", activeConversationId);
      console.log("Joined conversation:", activeConversationId);

      return () => {
        if (socketRef.current?.connected) {
          socketRef.current.emit("leave:conversation", activeConversationId);
          console.log("Left conversation:", activeConversationId);
        }
      };
    }
  }, [isGroupChat, activeConversationId]);

  // Set threads when fetched
  useEffect(() => {
    if (isThreadsSuccess && (threads as any)?.data) {
      setThreadsState((threads as any).data);
    }
  }, [isThreadsSuccess, threads]);

  // Mark messages as read
  useEffect(() => {
    if (!activeId || isGroupChat || !messagesState.length) return;

    // Debounce mark as read to avoid excessive calls
    const timeoutId = setTimeout(() => {
      markMessageAsReadAsync(activeId);
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, isGroupChat, messagesState.length]); // Only mark as read when messages change

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesState]);

  // Sync sending state with ref
  useEffect(() => {
    sendingRef.current = sending;
  }, [sending]);

  // Send message via WebSocket (mirror desktop behavior)
  const postId: string | null = null;
  async function handleSendMessage() {
    const currentId = isGroupChat ? activeConversationId : activeId;
    if (!newMessage.trim() || !socketRef.current || !currentId || sending)
      return;

    setSending(true);
    sendingRef.current = true;
    const tempId = `tmp_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    const content = newMessage;

    // optimistic append
    setMessagesState((prev) => [
      ...prev,
      {
        id: tempId,
        senderId: userId,
        receiverId: isGroupChat ? undefined : activeId,
        conversationId: isGroupChat ? activeConversationId : undefined,
        content,
        pending: true,
      } as any,
    ]);

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
          // fallback to HTTP
          const httpPayload = isGroupChat
            ? { conversationId: activeConversationId, content }
            : { content, receiverId: activeId };
          sendMessageAPIAsync(httpPayload as any)
            .then(() => {
              // let subsequent fetch/socket update the temp message
            })
            .catch(() => {
              setMessagesState((prev) =>
                prev.map((m) =>
                  m.id === tempId ? ({ ...m, failed: true } as any) : m
                )
              );
            });
          return;
        }

        if (ack.ok && ack.message) {
          setMessagesState((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...(ack.message as any), pending: false } : m
            )
          );
        } else {
          setMessagesState((prev) =>
            prev.map((m) =>
              m.id === tempId
                ? ({ ...m, pending: false, failed: true } as any)
                : m
            )
          );
          console.error("send failed", ack.error);
          toast.error(ack.error || "Failed to send message");
        }
      }
    );
  }

  const handleThreadSelect = (threadId: string, isGroup?: boolean) => {
    if (isGroup) {
      setIsGroupChat(true);
      setActiveConversationId(threadId);
      setActiveId(null);
      router.push(`/dashboard/teacher/messages?conversationId=${threadId}`);
    } else {
      setIsGroupChat(false);
      setActiveConversationId(null);
      setActiveId(threadId);
      router.push(`/dashboard/teacher/messages?chatId=${threadId}`);
    }
    setMessagesState([]); // Clear previous messages
  };

  const handleBack = () => {
    setActiveId(null);
    setActiveConversationId(null);
    setIsGroupChat(false);
    router.push("/dashboard/teacher/messages");
  };

  // Handle confirmation modal actions
  const handleConfirmAction = async () => {
    if (!confirmModal) return;

    setIsConfirmLoading(true);
    try {
      switch (confirmModal.type) {
        case "leaveGroup":
          await leaveGroupAsync(confirmModal.id);
          toast.success(`Left "${confirmModal.name}" group`);
          setActiveConversationId(null);
          setIsGroupChat(false);
          router.push("/dashboard/teacher/messages");
          break;
        case "deleteThread":
          await deleteDirectChatAsync(confirmModal.id);
          toast.success(`Deleted conversation with ${confirmModal.name}`);
          setActiveId(null);
          router.push("/dashboard/teacher/messages");
          break;
        case "blockUser":
          await blockUserAsync({ userId: confirmModal.id });
          toast.success(`Blocked ${confirmModal.name}`);
          break;
        case "unblockUser":
          await unblockUserAsync(confirmModal.id);
          toast.success(`Unblocked ${confirmModal.name}`);
          break;
      }
    } catch (error: any) {
      toast.error(error?.message || "Action failed");
    } finally {
      setIsConfirmLoading(false);
      setConfirmModal(null);
    }
  };

  // Get confirmation modal config
  const getConfirmModalConfig = () => {
    if (!confirmModal) return null;

    const configs = {
      leaveGroup: {
        title: "Leave Group",
        message: `Are you sure you want to leave "${confirmModal.name}"?`,
        confirmText: "Leave Group",
        icon: <LogOut className="w-6 h-6 text-orange-500" />,
        confirmClass: "bg-orange-500 hover:bg-orange-600",
      },
      deleteThread: {
        title: "Delete Conversation",
        message: `Are you sure you want to delete your conversation with ${confirmModal.name}? This cannot be undone.`,
        confirmText: "Delete",
        icon: <Trash2 className="w-6 h-6 text-red-500" />,
        confirmClass: "bg-red-500 hover:bg-red-600",
      },
      blockUser: {
        title: "Block User",
        message: `Are you sure you want to block ${confirmModal.name}? They won't be able to message you.`,
        confirmText: "Block User",
        icon: <Ban className="w-6 h-6 text-red-500" />,
        confirmClass: "bg-red-500 hover:bg-red-600",
      },
      unblockUser: {
        title: "Unblock User",
        message: `Are you sure you want to unblock ${confirmModal.name}?`,
        confirmText: "Unblock",
        icon: <UserCheck className="w-6 h-6 text-green-500" />,
        confirmClass: "bg-green-500 hover:bg-green-600",
      },
    };

    return configs[confirmModal.type!];
  };

  // Build a lookup map of userId -> user info from conversations (for group chat sender names)
  const userLookup = useMemo(() => {
    const lookup = new Map<
      string,
      { name: string; profilePictureUrl?: string | null }
    >();

    // Add from conversations members
    if (conversations) {
      conversations.forEach((conv: any) => {
        conv.members?.forEach((member: any) => {
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
      threads.data.forEach((thread: any) => {
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

  // Get active thread info
  const activeThread = threadsState.find(
    (thread) => thread.partnerId === activeId
  );
  const activeGroup = conversations?.find(
    (conv: any) => conv.id === activeConversationId
  );

  // Check if current conversation is blocked (for direct messages only)
  const isCurrentChatBlocked = !isGroupChat && activeThread?.isBlocked;
  const isCurrentChatBlockedByThem =
    !isGroupChat && activeThread?.isBlockedByThem;
  const cannotSendMessage = isCurrentChatBlocked || isCurrentChatBlockedByThem;

  // Show threads list if no active thread/group
  if (!activeId && !activeConversationId) {
    return (
      <div className="flex flex-col h-screen ">
        {/* Tab Navigation */}
        <div className="sticky top-0 z-20 border-b border-gray-200">
          <MobileTabNavigation tabs={tabs} />
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
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
          ) : threadsState.length === 0 &&
            (!conversations ||
              conversations.filter((c: any) => c.type === "group").length ===
                0) ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {/* Create Group Button */}
              <Button
                variant="primary"
                onClick={() => setShowCreateGroupModal(true)}
                className="w-full mb-2"
                icon={<Users size={18} />}
              >
                Create New Group
              </Button>

              {/* Direct Messages */}
              {threadsState.map((thread: Threads) => (
                <ThreadBox
                  key={thread.partnerId}
                  chatId={thread.partnerId}
                  name={thread.partnerName}
                  unreadCount={
                    thread.unreadCount ||
                    unreadCounts[thread.partnerId || ""] ||
                    0
                  }
                  lastMessage={thread.lastMessage}
                  isActive={!isGroupChat && thread.partnerId === activeId}
                  isOnline={onlineUsers.has(thread.partnerId || "")}
                  profilePictureUrl={thread.partnerProfilePicture}
                  onSelect={(id) => handleThreadSelect(id, false)}
                  isGroup={false}
                  isBlocked={thread.isBlocked}
                  isBlockedByThem={thread.isBlockedByThem}
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
                  onOpenMobileActions={(actions) => {
                    setMobileActionsSheet({ actions });
                  }}
                />
              ))}

              {/* Group Conversations */}
              {conversations
                ?.filter((conv: any) => conv.type === "group")
                .map((group: any) => (
                  <ThreadBox
                    key={group.id}
                    conversationId={group.id}
                    name={group.name}
                    unreadCount={group.unreadCount || 0}
                    lastMessage={
                      group.lastMessage?.content ||
                      group.messages?.[0]?.content ||
                      "No messages yet"
                    }
                    isActive={isGroupChat && activeConversationId === group.id}
                    onSelect={(id) => handleThreadSelect(id, true)}
                    isOnline={false}
                    isGroup={true}
                    onLeaveGroup={(conversationId) => {
                      setConfirmModal({
                        type: "leaveGroup",
                        id: conversationId,
                        name: group.name,
                      });
                    }}
                    onViewMembers={(convId) => {
                      // Set the active conversation first so the hook fetches data
                      setActiveConversationId(convId);
                      setIsGroupChat(true);
                      setShowMembersSheet(true);
                    }}
                    onOpenMobileActions={(actions) => {
                      setMobileActionsSheet({ actions });
                    }}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Mobile Actions Bottom Sheet - for threads list view */}
        <BottomSheet
          isOpen={!!mobileActionsSheet}
          onClose={() => setMobileActionsSheet(null)}
          title="Actions"
          maxHeight="60vh"
        >
          <div className="p-4 pb-8">
            <div className="flex flex-col gap-2">
              {mobileActionsSheet?.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    action.onClick();
                    setMobileActionsSheet(null);
                  }}
                  className={`flex items-center gap-4 w-full px-4 py-4 rounded-xl text-left font-medium transition-colors ${
                    action.className ||
                    "text-gray-800 hover:bg-gray-100 active:bg-gray-200"
                  }`}
                >
                  <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {action.icon}
                  </span>
                  <span className="text-base">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </BottomSheet>

        {/* Confirmation Bottom Sheet - for threads list view */}
        <BottomSheet
          isOpen={!!confirmModal}
          onClose={() => !isConfirmLoading && setConfirmModal(null)}
          title={getConfirmModalConfig()?.title}
          maxHeight="50vh"
        >
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                {getConfirmModalConfig()?.icon}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {getConfirmModalConfig()?.message}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmAction}
                disabled={isConfirmLoading}
                className={`w-full px-4 py-3.5 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                  getConfirmModalConfig()?.confirmClass
                }`}
              >
                {isConfirmLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  getConfirmModalConfig()?.confirmText
                )}
              </button>
              <button
                onClick={() => setConfirmModal(null)}
                disabled={isConfirmLoading}
                className="w-full px-4 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </BottomSheet>

        {/* ===== GROUP MEMBERS BOTTOM SHEET - Threads List View ===== */}
        <BottomSheet
          isOpen={showMembersSheet}
          onClose={() => {
            setShowMembersSheet(false);
            setMemberSearchQuery("");
          }}
          title=""
          maxHeight="85vh"
        >
          <div className="flex flex-col h-full">
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-5 py-6 text-white -mt-[1px]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Users className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold truncate">
                    {fetchedGroupName || "Group Members"}
                  </h2>
                  <p className="text-white/80 flex items-center gap-2 mt-0.5">
                    <Users className="w-4 h-4" />
                    {memberCount || 0}{" "}
                    {memberCount === 1 ? "member" : "members"}
                  </p>
                </div>
              </div>
              {isGroupOwner && (
                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-yellow-400/20 rounded-full w-fit">
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium text-yellow-200">
                    You&apos;re the owner
                  </span>
                </div>
              )}
            </div>

            {/* Search & Add Button */}
            <div className="px-4 py-3 border-b border-gray-100 bg-white">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    placeholder="Search members..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                {isGroupOwner && (
                  <button
                    onClick={() => setShowAddMemberSheet(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Members List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
              {isGroupMembersLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                  <p className="text-gray-500">Loading members...</p>
                </div>
              ) : isGroupMembersError ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    Unable to load members
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Please try again later
                  </p>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No members found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {memberSearchQuery
                      ? "Try a different search term"
                      : "This group has no members"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMembers.map((member: any) => (
                    <div
                      key={member.id}
                      className="relative flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm"
                    >
                      <div className="relative flex-shrink-0">
                        {member.user?.profilePictureUrl ? (
                          <Image
                            src={member.user.profilePictureUrl}
                            alt={member.user.name || ""}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-white shadow-md">
                            <span className="text-white font-semibold text-lg">
                              {member.user?.name?.[0]?.toUpperCase() || "?"}
                            </span>
                          </div>
                        )}
                        {member.isOwner && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-gray-800 truncate">
                            {member.user?.name || "Unknown User"}
                          </h4>
                          {member.isOwner && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-medium rounded-full">
                              Owner
                            </span>
                          )}
                          {member.role === "admin" && !member.isOwner && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded-full flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          Joined {formatMemberDate(member.joinedAt)}
                        </div>
                      </div>
                      {isGroupOwner && !member.isOwner && (
                        <button
                          onClick={() =>
                            setRemoveMemberConfirm({
                              userId: member.userId,
                              userName: member.user?.name || "Unknown",
                            })
                          }
                          className="p-2.5 text-red-500 hover:bg-red-50 active:bg-red-100 rounded-xl transition-all"
                        >
                          <UserMinus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-4 bg-white border-t border-gray-100">
              <button
                onClick={() => {
                  setShowMembersSheet(false);
                  setMemberSearchQuery("");
                }}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </BottomSheet>

        {/* ===== ADD MEMBER BOTTOM SHEET - Threads List View ===== */}
        <BottomSheet
          isOpen={showAddMemberSheet}
          onClose={closeAddMemberSheet}
          title="Add Members"
          maxHeight="85vh"
        >
          <div className="flex flex-col h-full">
            {selectedUsersToAdd.length > 0 && (
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Selected ({selectedUsersToAdd.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsersToAdd.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-2 py-1"
                    >
                      {user.profilePictureUrl ? (
                        <Image
                          src={user.profilePictureUrl}
                          alt={user.name}
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-[10px] font-medium">
                            {user.name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gray-800">{user.name}</span>
                      <button
                        onClick={() => toggleUserSelection(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X width={14} height={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-4 py-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={addMemberSearchQuery}
                  onChange={(e) => setAddMemberSearchQuery(e.target.value)}
                  placeholder="Search users to add..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
              {isSearchingUsers ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
                  <p className="text-gray-500 text-sm">Loading users...</p>
                </div>
              ) : availableUsersToAdd.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Users className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    {addMemberSearchQuery
                      ? "No users found"
                      : "No more users to add"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {addMemberSearchQuery
                      ? "Try a different search term"
                      : "All users are already members"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableUsersToAdd.map((user: any) => {
                    const isSelected = selectedUsersToAdd.some(
                      (u) => u.id === user.id
                    );
                    return (
                      <button
                        key={user.id}
                        onClick={() => toggleUserSelection(user)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                          isSelected
                            ? "bg-blue-50 border-2 border-blue-500"
                            : "bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100"
                        }`}
                      >
                        {user.profilePictureUrl ? (
                          <Image
                            src={user.profilePictureUrl}
                            alt={user.name}
                            width={44}
                            height={44}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-4 py-4 border-t border-gray-100 bg-white flex gap-3">
              <button
                onClick={closeAddMemberSheet}
                className="flex-1 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMembersSubmit}
                disabled={isAddingMembers || selectedUsersToAdd.length === 0}
                className="flex-1 py-3.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isAddingMembers ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  `Add ${
                    selectedUsersToAdd.length > 0
                      ? `(${selectedUsersToAdd.length})`
                      : ""
                  }`
                )}
              </button>
            </div>
          </div>
        </BottomSheet>

        {/* ===== REMOVE MEMBER CONFIRMATION - Threads List View ===== */}
        <BottomSheet
          isOpen={!!removeMemberConfirm}
          onClose={() => !isRemovingMember && setRemoveMemberConfirm(null)}
          title="Remove Member"
          maxHeight="45vh"
        >
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-gray-800">
                  {removeMemberConfirm?.userName}
                </span>{" "}
                from this group? They will no longer be able to see or send
                messages.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRemoveMemberSubmit}
                disabled={isRemovingMember}
                className="w-full px-4 py-3.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRemovingMember ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Remove Member"
                )}
              </button>
              <button
                onClick={() => setRemoveMemberConfirm(null)}
                disabled={isRemovingMember}
                className="w-full px-4 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </BottomSheet>

        {/* User Profile Modal - Threads List View */}
        <UserProfileModal
          isOpen={!!profileModalUserId}
          onClose={() => setProfileModalUserId(null)}
          userId={profileModalUserId}
          onBlock={() => {
            setProfileModalUserId(null);
          }}
        />

        {/* Create Group Bottom Sheet - Threads List View */}
        <BottomSheet
          isOpen={showCreateGroupModal}
          onClose={closeCreateGroupModal}
          title=""
          maxHeight="90vh"
        >
          <form
            onSubmit={handleSubmit(handleCreateGroup)}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Create Group Chat
                </h2>
                {/* <button
                  type="button"
                  onClick={closeCreateGroupModal}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button> */}
              </div>
              <p className="text-xs text-gray-500">
                Start a group conversation with multiple teachers
              </p>
            </div>

            {/* Group Name Input */}
            <div className="px-4 py-3 border-b border-gray-100">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Group Name
              </label>
              <input
                type="text"
                placeholder="e.g., ECBA Moderators Group"
                {...register("name", {
                  required: "Group name is required",
                  minLength: {
                    value: 3,
                    message: "Group name must be at least 3 characters",
                  },
                })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Selected Members Preview */}
            {selectedGroupMembers.length > 0 && (
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                <p className="text-xs font-medium text-blue-800 mb-2">
                  Selected ({selectedGroupMembers.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedGroupMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-1.5 bg-white border border-blue-200 rounded-lg px-2 py-1"
                    >
                      {member.profilePictureUrl ? (
                        <Image
                          src={member.profilePictureUrl}
                          alt={member.name || ""}
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-[10px] font-medium">
                            {member.name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-gray-800">
                        {member.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleGroupMemberSelection(member)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X width={12} height={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Users */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teachers to add..."
                  value={createGroupSearchTerm}
                  onChange={(e) => setCreateGroupSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Select Members (minimum 2)
              </p>
              {isSearchingCreateGroupUsers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="ml-2 text-xs text-gray-600">
                    Loading users...
                  </span>
                </div>
              ) : availableCreateGroupUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  {createGroupSearchTerm
                    ? "No users found"
                    : "No users available"}
                </div>
              ) : (
                <div className="space-y-2">
                  {availableCreateGroupUsers.map((user: User) => {
                    const isSelected = selectedGroupMembers.some(
                      (m) => m.id === user.id
                    );
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleGroupMemberSelection(user)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          isSelected
                            ? "bg-blue-50 border-2 border-blue-500"
                            : "bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100"
                        }`}
                      >
                        {user.profilePictureUrl ? (
                          <Image
                            src={user.profilePictureUrl}
                            alt={user.name || ""}
                            width={44}
                            height={44}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <X width={12} height={12} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="px-4 py-4 border-t border-gray-100 bg-white flex gap-3">
              <button
                type="button"
                onClick={closeCreateGroupModal}
                disabled={isCreatingGroup}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingGroup || selectedGroupMembers.length < 2}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCreatingGroup ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    Create Group
                  </>
                )}
              </button>
            </div>
          </form>
        </BottomSheet>
      </div>
    );
  }

  // Show chat view
  return (
    <div className="flex flex-col h-screen bg-[#FDFDFD]">
      {/* Header with Back Button and Partner Info */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-[#0C0C0C]" />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isGroupChat ? (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-[#368FFF] flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            ) : activeThread?.partnerProfilePicture ? (
              <div
                className={`relative ${
                  cannotSendMessage ? "grayscale opacity-60" : ""
                }`}
              >
                <Image
                  src={activeThread.partnerProfilePicture}
                  alt={activeThread.partnerName}
                  width={40}
                  height={40}
                  className={`w-10 h-10 rounded-full object-cover border-2 ${
                    cannotSendMessage ? "border-gray-300" : "border-[#368FFF]"
                  }`}
                />
                {cannotSendMessage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Ban className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  cannotSendMessage
                    ? "bg-gray-400 border-gray-300"
                    : "bg-[#90BDFD] border-[#368FFF]"
                }`}
              >
                {cannotSendMessage ? (
                  <Ban className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white text-lg font-semibold">
                    {activeThread?.partnerName?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-[#0C0C0C] text-base font-medium truncate">
                {isGroupChat
                  ? activeGroup?.name || "Group Chat"
                  : activeThread?.partnerName || "User"}
              </h4>
              {!isGroupChat &&
                onlineUsers.has(activeId || "") &&
                !cannotSendMessage && (
                  <p className="text-xs text-green-500">Online</p>
                )}
              {cannotSendMessage && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Ban className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs text-red-500 font-medium">
                    {isCurrentChatBlocked ? "Blocked" : "Cannot message"}
                  </span>
                </div>
              )}
              {isGroupChat && (
                <button
                  onClick={() => setShowMembersSheet(true)}
                  className="text-xs text-blue-500 flex items-center gap-1"
                >
                  <UsersRound className="w-3 h-3" />
                  View members
                </button>
              )}
            </div>
          </div>
          {/* Members Button for Group Chat */}
          {isGroupChat && (
            <button
              onClick={() => setShowMembersSheet(true)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <UsersRound size={18} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-2">
          {isMessagesLoading ? (
            <MessagesLoading />
          ) : messagesState.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <p className="text-gray-500">
                Chat room – Messages will appear here
              </p>
            </div>
          ) : (
            messagesState.map((message) => {
              const isOwn = message.senderId === userId;
              const senderUserId =
                (message as any).sender?.id || message.senderId;
              const lookupUser = message.senderId
                ? userLookup.get(message.senderId)
                : null;
              const senderName =
                (message as any).sender?.name ||
                lookupUser?.name ||
                activeThread?.partnerName ||
                "User";
              const senderProfilePic =
                (message as any).sender?.profilePictureUrl ||
                lookupUser?.profilePictureUrl ||
                activeThread?.partnerProfilePicture;

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isOwn && (
                    <button
                      onClick={() =>
                        senderUserId && setProfileModalUserId(senderUserId)
                      }
                      className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full"
                    >
                      {senderProfilePic ? (
                        <Image
                          src={senderProfilePic}
                          alt={senderName}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover border-2 border-[#368FFF]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#368FFF] hover:bg-blue-400 flex items-center justify-center text-white font-semibold text-sm border-2 border-[#368FFF] hover:border-blue-400 transition-colors">
                          {senderName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>
                  )}
                  <div
                    className={`max-w-[70%] p-3 my-1 rounded-xl relative break-words ${
                      isOwn
                        ? "bg-[#368FFF] text-white self-end ml-auto"
                        : "bg-gray-200 text-black self-start mr-auto"
                    }`}
                  >
                    <div
                      className={`absolute w-3 h-3 bg-inherit transform rotate-45 ${
                        isOwn ? "bottom-0 right-[-6px]" : "bottom-0 left-[-6px]"
                      }`}
                    />
                    {message.content}
                    <div className="flex items-center justify-between mt-1">
                      {!isOwn && isGroupChat && (
                        <span className="text-[10px] text-gray-600 font-medium mr-4">
                          {senderName}
                        </span>
                      )}
                      <span
                        className={`text-[10px] ${
                          isOwn ? "text-white/80" : "text-black"
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
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* chat input */}
      <div className="px-4 md:px-6 py-4">
        {cannotSendMessage ? (
          /* Blocked Message Banner */
          <div className="flex items-center gap-3 py-3 px-4 bg-gray-100 border border-gray-200 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              {isCurrentChatBlocked ? (
                <Ban className="w-5 h-5 text-gray-500" />
              ) : (
                <ShieldOff className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
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
                className="px-3 py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
              >
                Unblock
              </button>
            )}
          </div>
        ) : (
          /* Normal Input */
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <div className="relative flex flex-row items-center">
                {/* Message input - no emoji picker on mobile (native keyboard has emojis) */}
                <div className="relative w-full">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="w-full pl-3 pr-3 py-2 border border-[#DBDBDB] rounded-lg resize-none focus:outline-none focus:border-[#368FFF] h-[50px] leading-6"
                    rows={1}
                    disabled={cannotSendMessage}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={
                !newMessage.trim() ||
                sending ||
                (!activeId && !activeConversationId) ||
                cannotSendMessage
              }
              className="bg-[#368FFF] hover:bg-[#2574db] disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200 flex items-center justify-center w-[50px] h-[50px]"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Create Group Bottom Sheet */}
      <BottomSheet
        isOpen={showCreateGroupModal}
        onClose={closeCreateGroupModal}
        title=""
        maxHeight="90vh"
      >
        <form
          onSubmit={handleSubmit(handleCreateGroup)}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Create Group Chat
              </h2>
              {/* <button
                type="button"
                onClick={closeCreateGroupModal}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button> */}
            </div>
            <p className="text-xs text-gray-500">
              Start a group conversation with multiple teachers
            </p>
          </div>

          {/* Group Name Input */}
          <div className="px-4 py-3 border-b border-gray-100">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Group Name
            </label>
            <input
              type="text"
              placeholder="e.g., ECBA Moderators Group"
              {...register("name", {
                required: "Group name is required",
                minLength: {
                  value: 3,
                  message: "Group name must be at least 3 characters",
                },
              })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Selected Members Preview */}
          {selectedGroupMembers.length > 0 && (
            <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
              <p className="text-xs font-medium text-blue-800 mb-2">
                Selected ({selectedGroupMembers.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedGroupMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-1.5 bg-white border border-blue-200 rounded-lg px-2 py-1"
                  >
                    {member.profilePictureUrl ? (
                      <Image
                        src={member.profilePictureUrl}
                        alt={member.name || ""}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-medium">
                          {member.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-gray-800">{member.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleGroupMemberSelection(member)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X width={12} height={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Users */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search teachers to add..."
                value={createGroupSearchTerm}
                onChange={(e) => setCreateGroupSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Select Members (minimum 2)
            </p>
            {isSearchingCreateGroupUsers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="ml-2 text-xs text-gray-600">
                  Loading users...
                </span>
              </div>
            ) : availableCreateGroupUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                {createGroupSearchTerm
                  ? "No users found"
                  : "No users available"}
              </div>
            ) : (
              <div className="space-y-2">
                {availableCreateGroupUsers.map((user: User) => {
                  const isSelected = selectedGroupMembers.some(
                    (m) => m.id === user.id
                  );
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleGroupMemberSelection(user)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        isSelected
                          ? "bg-blue-50 border-2 border-blue-500"
                          : "bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100"
                      }`}
                    >
                      {user.profilePictureUrl ? (
                        <Image
                          src={user.profilePictureUrl}
                          alt={user.name || ""}
                          width={44}
                          height={44}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <X width={12} height={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-4 border-t border-gray-100 bg-white flex gap-3">
            <button
              type="button"
              onClick={closeCreateGroupModal}
              disabled={isCreatingGroup}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingGroup || selectedGroupMembers.length < 2}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCreatingGroup ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  Create Group
                </>
              )}
            </button>
          </div>
        </form>
      </BottomSheet>

      {/* Mobile Actions Bottom Sheet */}
      <BottomSheet
        isOpen={!!mobileActionsSheet}
        onClose={() => setMobileActionsSheet(null)}
        title="Actions"
        maxHeight="60vh"
      >
        <div className="p-4 pb-8">
          <div className="flex flex-col gap-2">
            {mobileActionsSheet?.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.onClick();
                  setMobileActionsSheet(null);
                }}
                className={`flex items-center gap-4 w-full px-4 py-4 rounded-xl text-left font-medium transition-colors ${
                  action.className ||
                  "text-gray-800 hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {action.icon}
                </span>
                <span className="text-base">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* Confirmation Bottom Sheet */}
      <BottomSheet
        isOpen={!!confirmModal}
        onClose={() => !isConfirmLoading && setConfirmModal(null)}
        title={getConfirmModalConfig()?.title}
        maxHeight="50vh"
      >
        <div className="p-6">
          {/* Icon and Content */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              {getConfirmModalConfig()?.icon}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {getConfirmModalConfig()?.message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirmAction}
              disabled={isConfirmLoading}
              className={`w-full px-4 py-3.5 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                getConfirmModalConfig()?.confirmClass
              }`}
            >
              {isConfirmLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                getConfirmModalConfig()?.confirmText
              )}
            </button>
            <button
              onClick={() => setConfirmModal(null)}
              disabled={isConfirmLoading}
              className="w-full px-4 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* ===== GROUP MEMBERS BOTTOM SHEET ===== */}
      <BottomSheet
        isOpen={showMembersSheet}
        onClose={() => {
          setShowMembersSheet(false);
          setMemberSearchQuery("");
        }}
        title=""
        maxHeight="85vh"
      >
        <div className="flex flex-col h-full">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-5 py-6 text-white -mt-[1px]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold truncate">
                  {fetchedGroupName || activeGroup?.name || "Group Members"}
                </h2>
                <p className="text-white/80 flex items-center gap-2 mt-0.5">
                  <Users className="w-4 h-4" />
                  {memberCount || 0} {memberCount === 1 ? "member" : "members"}
                </p>
              </div>
            </div>
            {/* Owner badge */}
            {isGroupOwner && (
              <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-yellow-400/20 rounded-full w-fit">
                <Crown className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium text-yellow-200">
                  You&apos;re the owner
                </span>
              </div>
            )}
          </div>

          {/* Search & Add Button */}
          <div className="px-4 py-3 border-b border-gray-100 bg-white">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  placeholder="Search members..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              {isGroupOwner && (
                <button
                  onClick={() => setShowAddMemberSheet(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
            {isGroupMembersLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                <p className="text-gray-500">Loading members...</p>
              </div>
            ) : isGroupMembersError ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-gray-600 font-medium">
                  Unable to load members
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Please try again later
                </p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No members found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {memberSearchQuery
                    ? "Try a different search term"
                    : "This group has no members"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMembers.map((member: any) => (
                  <div
                    key={member.id}
                    className="relative flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {member.user?.profilePictureUrl ? (
                        <Image
                          src={member.user.profilePictureUrl}
                          alt={member.user.name || ""}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-white shadow-md">
                          <span className="text-white font-semibold text-lg">
                            {member.user?.name?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                      {member.isOwner && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {member.user?.name || "Unknown User"}
                        </h4>
                        {member.isOwner && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-medium rounded-full">
                            Owner
                          </span>
                        )}
                        {member.role === "admin" && !member.isOwner && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded-full flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        Joined {formatMemberDate(member.joinedAt)}
                      </div>
                    </div>

                    {/* Remove Button - Only for owner, can't remove themselves */}
                    {isGroupOwner && !member.isOwner && (
                      <button
                        onClick={() =>
                          setRemoveMemberConfirm({
                            userId: member.userId,
                            userName: member.user?.name || "Unknown",
                          })
                        }
                        className="p-2.5 text-red-500 hover:bg-red-50 active:bg-red-100 rounded-xl transition-all"
                      >
                        <UserMinus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-4 bg-white border-t border-gray-100">
            <button
              onClick={() => {
                setShowMembersSheet(false);
                setMemberSearchQuery("");
              }}
              className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* ===== ADD MEMBER BOTTOM SHEET ===== */}
      <BottomSheet
        isOpen={showAddMemberSheet}
        onClose={closeAddMemberSheet}
        title="Add Members"
        maxHeight="85vh"
      >
        <div className="flex flex-col h-full">
          {/* Selected Users Preview */}
          {selectedUsersToAdd.length > 0 && (
            <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Selected ({selectedUsersToAdd.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedUsersToAdd.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-2 py-1"
                  >
                    {user.profilePictureUrl ? (
                      <Image
                        src={user.profilePictureUrl}
                        alt={user.name || ""}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-medium">
                          {user.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-800">{user.name}</span>
                    <button
                      onClick={() => toggleUserSelection(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X width={14} height={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={addMemberSearchQuery}
                onChange={(e) => setAddMemberSearchQuery(e.target.value)}
                placeholder="Search users to add..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
            {isSearchingUsers ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
                <p className="text-gray-500 text-sm">Loading users...</p>
              </div>
            ) : availableUsersToAdd.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Users className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">
                  {addMemberSearchQuery
                    ? "No users found"
                    : "No more users to add"}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {addMemberSearchQuery
                    ? "Try a different search term"
                    : "All users are already members"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableUsersToAdd.map((user: any) => {
                  const isSelected = selectedUsersToAdd.some(
                    (u) => u.id === user.id
                  );
                  return (
                    <button
                      key={user.id}
                      onClick={() => toggleUserSelection(user)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                        isSelected
                          ? "bg-blue-50 border-2 border-blue-500"
                          : "bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100"
                      }`}
                    >
                      {user.profilePictureUrl ? (
                        <Image
                          src={user.profilePictureUrl}
                          alt={user.name || ""}
                          width={44}
                          height={44}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-100 bg-white flex gap-3">
            <button
              onClick={closeAddMemberSheet}
              className="flex-1 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMembersSubmit}
              disabled={isAddingMembers || selectedUsersToAdd.length === 0}
              className="flex-1 py-3.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isAddingMembers ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Adding...
                </>
              ) : (
                `Add ${
                  selectedUsersToAdd.length > 0
                    ? `(${selectedUsersToAdd.length})`
                    : ""
                }`
              )}
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* ===== REMOVE MEMBER CONFIRMATION BOTTOM SHEET ===== */}
      <BottomSheet
        isOpen={!!removeMemberConfirm}
        onClose={() => !isRemovingMember && setRemoveMemberConfirm(null)}
        title="Remove Member"
        maxHeight="45vh"
      >
        <div className="p-6">
          {/* Icon and Message */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-600 leading-relaxed">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-gray-800">
                {removeMemberConfirm?.userName}
              </span>{" "}
              from this group? They will no longer be able to see or send
              messages.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRemoveMemberSubmit}
              disabled={isRemovingMember}
              className="w-full px-4 py-3.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isRemovingMember ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove Member"
              )}
            </button>
            <button
              onClick={() => setRemoveMemberConfirm(null)}
              disabled={isRemovingMember}
              className="w-full px-4 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={!!profileModalUserId}
        onClose={() => setProfileModalUserId(null)}
        userId={profileModalUserId}
        onBlock={() => {
          // Close modal after blocking
          setProfileModalUserId(null);
        }}
      />
    </div>
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
