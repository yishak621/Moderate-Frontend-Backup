"use client";

import { ThreadBox } from "@/modules/dashboard/teacher/ThreadBox";
import { useEffect, useRef, useState } from "react";
import {
  Brain,
  User,
  Loader2,
  MessageSquare,
  Send,
  Users,
  SmileIcon,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import {
  useGetMessages,
  useMarkMessageAsRead,
  useSendMessageAPI,
  useThreads,
} from "@/hooks/useMessage";
import { decoded } from "@/lib/currentUser";
import { Message, Thread, Threads } from "@/app/types/threads";
import EmojiPicker from "emoji-picker-react";
import { getToken } from "@/services/tokenService";
import { useSearchParams } from "next/navigation";
import { getSocketUrl } from "@/lib/socketConfig";
import Image from "next/image";
import MobileTabNavigation from "@/components/ui/MobileTabNavigation";
import MobileMessagesClient from "./MobileMessagesClient";

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

  const userId: string = decoded?.id || "";
  const [activeId, setActiveId] = useState<string | null>(null);

  const [chatId, setChatId] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);

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
  // Set messages when fetched
  useEffect(() => {
    if (isMessagesSuccess && messages?.messages) {
      setMessagesState(
        [...messages.messages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
    }
  }, [isMessagesSuccess, messages]);

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
      console.log(`${userId} is online`);
    });

    socket.on("user:offline", ({ userId, lastSeen }) => {
      console.log(`${userId} went offline at ${lastSeen}`);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("Socket connection error:", err.message);
    });
    socket.on("message:new", (message: Message) => {
      // ensure message has a createdAt timestamp
      const normalizedMessage = {
        ...message,
        createdAt: message.createdAt ?? new Date().toISOString(),
      };

      // check chat relevance
      if (
        normalizedMessage.senderId === activeId ||
        normalizedMessage.receiverId === activeId
      ) {
        // append & always keep messages sorted chronologically
        setMessagesState((prev) =>
          [...prev, normalizedMessage].sort(
            (a, b) =>
              new Date(a.createdAt ?? "").getTime() -
              new Date(b.createdAt ?? "").getTime()
          )
        );
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
          [normalizedMessage.senderId]:
            (prev[normalizedMessage.senderId] || 0) + 1,
        }));
      }

      // play sound for received messages
      if (normalizedMessage.senderId !== userId) {
        audioRef.current
          ?.play()
          .catch(() => console.warn("Audio play prevented"));
      }
    });

    socket.on(
      "message:read",
      ({ senderId, readAt }: { senderId: string; readAt: string }) => {
        setMessagesState((prev) =>
          prev.map((m) => (m.senderId === senderId ? { ...m, readAt } : m))
        );
      }
    );

    return () => {
      socket.off("user:online");
      socket.off("user:offline");
      socket.disconnect();
    };
  }, [userId, activeId, token]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesState]);

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

  // Mark messages as read
  useEffect(() => {
    if (!activeId) return;

    const markAsRead = async () => {
      try {
        await markMessageAsReadAsync(activeId);
      } catch (err) {
        console.error(err);
      }
    };

    markAsRead();
  }, [activeId]);

  // Send message via WebSocket
  async function sendMessage() {
    if (!newMessage.trim() || !socketRef.current) return;

    setSending(true);
    const tempId = `tmp_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    const content = newMessage;

    setMessagesState((prev) => [
      ...prev,
      {
        id: tempId,
        senderId: userId,
        receiverId: "bot",
        content,
        pending: true,
      },
    ]);

    setNewMessage("");

    socketRef.current.emit(
      "message:send",
      { tempId, chatId, postId, receiverId: activeId, content },
      (ack: { ok?: boolean; message?: Message; error?: string }) => {
        if (!ack) {
          fallbackHttpSend({
            chatId,
            postId,
            receiverId: activeId!,
            content,
            tempId,
            sendMessageAPIAsync,
          });
          setSending(false);
          return;
        }
        if (ack.ok && ack.message) {
          setMessagesState((prev) =>
            prev.map((m) => (m.id === tempId ? ack.message! : m))
          );
        } else {
          setMessagesState((prev) =>
            prev.map((m) => (m.id === tempId ? { ...m, failed: true } : m))
          );
          console.error("send failed", ack.error);
        }
        setSending(false);
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

  useEffect(() => {
    const handleChatInit = async () => {
      const chatId = searchParams.get("chatId");
      if (!chatId || !threads?.data) return;

      // Check if thread already exists
      const existingThread = threads.data.find(
        (thread: Threads) => thread.partnerId === chatId
      );

      if (existingThread) {
        // ✅ Open existing thread
        setActiveId(existingThread.partnerId);
        setActiveThread(existingThread);
      }
    };

    handleChatInit();
  }, [searchParams, threads?.data]);

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

  console.log(activeThread, "activeThread");
  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden flex flex-col h-screen ">
        <MobileMessagesClient />
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <div className=" grid grid-cols-1 md:grid-cols-[25%_75%] gap-4   max-h-[90vh]">
          <div className="bg-[#FDFDFD] rounded-[22px] py-6 px-7  flex flex-col">
            <h4 className="text-[#0C0C0C] text-xl font-medium mb-5">Inbox</h4>

            <div className="flex flex-col gap-3">
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
                threads?.data.map((thread: Threads, idx: number) => (
                  <ThreadBox
                    chatId={thread?.partnerId}
                    key={idx}
                    name={thread.partnerName}
                    unreadCount={thread.unreadCount}
                    lastMessage={thread.lastMessage}
                    isActive={activeId === thread.partnerId}
                    onSelect={(id) => setActiveId(id)}
                    isOnline={onlineUsers.has(thread.partnerId)}
                    profilePictureUrl={thread?.partnerProfilePicture}
                  />
                ))
              )}
            </div>
          </div>
          <div className="bg-[#fdfdfd] py-4.5 rounded-[40px] flex flex-col h-[85vh] overflow-hidden">
            {/* top section */}
            <div className="flex flex-row pb-3 px-6 items-center gap-3.5 border-b border-b-[#DBDBDB]">
              <div className="w-[52px] h-[52px] bg-[#368FFF] rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              {isMessagesSuccess && (
                <p className="text-xl text-[#0c0c0c] font-medium">
                  Chat with{" "}
                  {
                    threads?.data.find(
                      (thread: Threads) => thread.partnerId === activeId
                    )?.partnerName
                  }
                </p>
              )}
            </div>

            {/* Chat messages area */}

            <div className="flex-1 min-h-0 p-6 flex flex-col justify-end">
              {/* Scroll container */}
              <div className="flex flex-col gap-2 overflow-y-scroll max-h-full scrollbar-hide px-4">
                {isMessagesLoading ? (
                  <MessagesLoading />
                ) : messagesState?.length ? (
                  messagesState?.map((message: Message) => {
                    const isSender = message.senderId !== activeId;

                    return (
                      <div key={message.id} className="flex items-end gap-2">
                        {!isSender && (
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
                            isSender
                              ? "bg-blue-500 text-white self-end ml-auto"
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
                          <span className="block text-[10px] mt-1 text-black text-right">
                            {new Date(
                              message.createdAt ?? Date.now()
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div ref={messagesEndRef} />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    Chat room – Messages will appear here
                  </div>
                )}
              </div>
            </div>

            {/* chat input */}
            <div className="px-6 py-4">
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
                        className="w-full pl-14 pr-3 py-2 border border-[#DBDBDB] rounded-lg resize-none focus:outline-none focus:border-[#368FFF] h-[50px] leading-6"
                        rows={1}
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-[#368FFF] hover:bg-[#2574db] disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200 flex items-center justify-center w-[50px] h-[50px]"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
