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
} from "@/hooks/useMessage";
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

  const userId: string = decoded?.id || "";
  const [activeId, setActiveId] = useState<string | null>(chatId);

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof window !== "undefined" ? new Audio("/audio/ping.mp3") : null
  );

  // HOOKS
  const { isThreadsLoading, isThreadsSuccess, threads } = useThreads(userId);
  const { isMessagesLoading, isMessagesSuccess, messages } = useGetMessages(
    activeId || ""
  );
  const { markMessageAsRead, markMessageAsReadAsync } = useMarkMessageAsRead();
  const {
    sendMessageAPIAsync,
    isSendMessageAPILoading,
    isSendMessageAPISuccess,
  } = useSendMessageAPI();

  // Set chatId from URL params
  useEffect(() => {
    const chatIdParam = searchParams.get("chatId");
    if (chatIdParam && chatIdParam !== activeId) {
      setActiveId(chatIdParam);
      setMessagesState([]); // Clear messages when switching threads
    } else if (!chatIdParam && activeId) {
      setActiveId(null);
      setMessagesState([]);
    }
  }, [searchParams, activeId]);

  // Set messages when fetched
  useEffect(() => {
    if (isMessagesSuccess && messages?.messages && activeId) {
      setMessagesState(
        [...messages.messages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
    } else if (!activeId) {
      setMessagesState([]);
    }
  }, [isMessagesSuccess, messages, activeId]);

  // Initialize socket
  useEffect(() => {
    const socket = io(getSocketUrl(), {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;
    socket.emit("user:online", { userId });

    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
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

    socket.on("message:new", (message: Message) => {
      // normalize createdAt like desktop
      const normalized = {
        ...message,
        createdAt: (message as any).createdAt ?? new Date().toISOString(),
      } as any;

      if (
        normalized.senderId === activeId ||
        normalized.receiverId === activeId
      ) {
        setMessagesState((prev) =>
          [...prev, normalized].sort(
            (a: any, b: any) =>
              new Date(a.createdAt ?? "").getTime() -
              new Date(b.createdAt ?? "").getTime()
          )
        );
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

      if (normalized.senderId !== userId) {
        audioRef.current?.play().catch(() => {});
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token, userId, activeId]);

  // Set threads when fetched
  useEffect(() => {
    if (isThreadsSuccess && (threads as any)?.data) {
      setThreadsState((threads as any).data);
    }
  }, [isThreadsSuccess, threads]);

  // Mark messages as read
  useEffect(() => {
    if (activeId && messagesState.length > 0) {
      markMessageAsReadAsync(activeId);
    }
  }, [activeId, messagesState.length, markMessageAsReadAsync]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesState]);

  // Send message via WebSocket (mirror desktop behavior)
  const postId: string | null = null;
  async function handleSendMessage() {
    if (!newMessage.trim() || !socketRef.current || !activeId || sending)
      return;

    setSending(true);
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
        receiverId: activeId,
        content,
        pending: true,
      } as any,
    ]);

    setNewMessage("");

    socketRef.current.emit(
      "message:send",
      { tempId, chatId, postId, receiverId: activeId, content },
      (ack: { ok?: boolean; message?: Message; error?: string }) => {
        if (!ack) {
          // fallback to HTTP
          sendMessageAPIAsync({ content, receiverId: activeId } as any)
            .then(() => {
              // let subsequent fetch/socket update the temp message
            })
            .catch(() => {
              setMessagesState((prev) =>
                prev.map((m) =>
                  m.id === tempId ? ({ ...m, failed: true } as any) : m
                )
              );
            })
            .finally(() => setSending(false));
          return;
        }
        if (ack.ok && ack.message) {
          setMessagesState((prev) =>
            prev.map((m) => (m.id === tempId ? (ack.message as any) : m))
          );
        } else {
          setMessagesState((prev) =>
            prev.map((m) =>
              m.id === tempId ? ({ ...m, failed: true } as any) : m
            )
          );
          console.error("send failed", ack.error);
        }
        setSending(false);
      }
    );
  }

  const handleThreadSelect = (threadId: string) => {
    setActiveId(threadId);
    setMessagesState([]); // Clear previous messages
    router.push(`/dashboard/teacher/messages?chatId=${threadId}`);
  };

  const handleBack = () => {
    setActiveId(null);
    router.push("/dashboard/teacher/messages");
  };

  // Get active thread info
  const activeThread = threadsState.find(
    (thread) => thread.partnerId === activeId
  );

  // Show threads list if no active thread
  if (!activeId) {
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
          ) : threadsState.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
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
                  isActive={thread.partnerId === activeId}
                  isOnline={onlineUsers.has(thread.partnerId || "")}
                  profilePictureUrl={thread.partnerProfilePicture}
                  onSelect={handleThreadSelect}
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
            {activeThread?.partnerProfilePicture ? (
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
                {activeThread?.partnerName || "User"}
              </h4>
              {onlineUsers.has(activeId) && (
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
                        activeThread?.partnerProfilePicture ||
                        "/images/sample-user.png"
                      }
                      alt={activeThread?.partnerName || "Receiver"}
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
                    <span className="block text-[10px] mt-1 text-black text-right">
                      {new Date(
                        message.createdAt ?? Date.now()
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
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
            disabled={!newMessage.trim() || sending}
            className="bg-[#368FFF] hover:bg-[#2574db] disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200 flex items-center justify-center w-[50px] h-[50px]"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
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
