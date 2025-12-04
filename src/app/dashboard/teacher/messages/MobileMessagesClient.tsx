"use client";

import { ThreadBox } from "@/modules/dashboard/teacher/ThreadBox";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, SmileIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetMessages,
  useMarkMessageAsRead,
  useSendMessageAPI,
  useThreads,
  useAllConversations,
  useGroupMessages,
} from "@/hooks/useMessage";
import CreateGroupModal from "@/modules/dashboard/teacher/messages/CreateGroupModal";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
import Button from "@/components/ui/Button";
import { decoded } from "@/lib/currentUser";
import { Message, Thread } from "@/app/types/threads";
import EmojiPicker from "emoji-picker-react";
import { getToken } from "@/services/tokenService";
import { getSocketUrl } from "@/lib/socketConfig";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import Image from "next/image";
import SectionLoading from "@/components/SectionLoading";
import { EmptyState } from "@/components/EmptyStateProps";
import MobileTabNavigation from "@/components/ui/MobileTabNavigation";
import { Loader2, Users, MessageSquare, Brain } from "lucide-react";
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
  const [showPicker, setShowPicker] = useState<boolean>(false);
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

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof window !== "undefined" ? new Audio("/audio/ping.mp3") : null
  );

  // HOOKS
  const { isThreadsLoading, isThreadsSuccess, threads } = useThreads(userId);
  const { conversations, isConversationsLoading } = useAllConversations();

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

  // Get active thread info
  const activeThread = threadsState.find(
    (thread) => thread.partnerId === activeId
  );
  const activeGroup = conversations?.find(
    (conv: any) => conv.id === activeConversationId
  );

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
              {threadsState.map((thread) => (
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
                  />
                ))}
            </div>
          )}
        </div>
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
              <Image
                src={activeThread.partnerProfilePicture}
                alt={activeThread.partnerName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#368FFF]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#90BDFD] border-2 border-[#368FFF] flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {activeThread?.partnerName?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-[#0C0C0C] text-base font-medium truncate">
                {isGroupChat
                  ? activeGroup?.name || "Group Chat"
                  : activeThread?.partnerName || "User"}
              </h4>
              {!isGroupChat && onlineUsers.has(activeId || "") && (
                <p className="text-xs text-green-500">Online</p>
              )}
            </div>
          </div>
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
              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isOwn && (
                    <Image
                      src={
                        (message as any).sender?.profilePictureUrl ||
                        activeThread?.partnerProfilePicture ||
                        "/images/sample-user.png"
                      }
                      alt={
                        (message as any).sender?.name ||
                        activeThread?.partnerName ||
                        "User"
                      }
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#368FFF]"
                    />
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
                        <span className="text-[10px] text-gray-600 font-medium">
                          {(message as any).sender?.name || "Unknown"}
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

      {/* chat input - Match desktop exactly */}
      <div className="px-6 py-4">
        <div className="flex gap-3 items-start">
          <div className="flex-1">
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition flex items-center justify-center"
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
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="w-full pl-14 pr-3 py-2 border border-[#DBDBDB] rounded-lg resize-none focus:outline-none focus:border-[#368FFF] h-[50px] leading-6"
                  rows={1}
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={
              !newMessage.trim() ||
              sending ||
              (!activeId && !activeConversationId)
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
      </div>

      {/* Create Group Modal */}
      <ResponsiveModal
        isOpen={showCreateGroupModal}
        onOpenChange={setShowCreateGroupModal}
      >
        <CreateGroupModal />
      </ResponsiveModal>
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
