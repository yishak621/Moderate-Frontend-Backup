"use client";

import { ThreadBox } from "@/modules/dashboard/teacher/ThreadBox";
import { useEffect, useState } from "react";
import { Brain, User, Loader2, MessageSquare, Send, Users } from "lucide-react";

import { useGetMessages, useThreads } from "@/hooks/useMessage";
import { decoded } from "@/lib/currentUser";
import { Message, Threads } from "@/app/types/threads";
import { useRouter } from "next/navigation";

// const sampleThreads = [
//   {
//     name: "Yisahk A.",
//     unreadCount: 8,
//     lastMessage: "this is the last message",
//     isActive: true,
//   },
//   {
//     name: "Ermi A.",
//     unreadCount: 8,
//     lastMessage: "this is the last message",
//   },
//   {
//     name: "Mahi K.",
//     unreadCount: 8,
//     lastMessage: "this is the last message",
//   },
//   {
//     name: "jHonasd A.",
//     unreadCount: 8,
//     lastMessage: "this is the last message",
//   },
// ];

//  "status": "success",
//   "data": [
//       {
//           "partnerId": "9be589e9-6311-4ce1-85af-35203ecad8f9",
//           "partnerName": "du lu duang",
//           "senderName": "Yishak 2",
//           "lastMessage": "Hello there is a misunderstanding in the quetion 4... let me know",
//           "lastMessageAt": "2025-09-12T16:29:34.911Z",
//           "messages": [
//               {
//                   "id": "a48a3247-906b-4cf9-9d0e-0617f1c1b7d8",
//                   "senderId": "3c2b3c91-9f5d-4aff-bf68-17aa47e240fb",
//                   "receiverId": "9be589e9-6311-4ce1-85af-35203ecad8f9",
//                   "content": "Hello there is a misunderstanding in the quetion 4... let me know",
//                   "createdAt": "2025-09-12T16:29:34.911Z"
//               },
//               {
//                   "id": "9a986ed1-0e6d-4c19-9969-7a678c1cbc81",
//                   "senderId": "3c2b3c91-9f5d-4aff-bf68-17aa47e240fb",
//                   "receiverId": "9be589e9-6311-4ce1-85af-35203ecad8f9",
//                   "content": "Let’s discuss your last submission.",
//                   "createdAt": "2025-09-12T16:29:03.947Z"
//               }
//           ],
//           "unreadCount": 0
//       },

export default function MessagesClientTeachers() {
  const [message, setMessage] = useState("");
  const [messagesState, setMessagesState] = useState([]);

  const userId = decoded?.id || "";
  const [activeId, setActiveId] = useState<string | null>(null);
  // const userId = decoded?.id;

  //HOOKS
  const { isThreadsLoading, isThreadsSuccess, threads } = useThreads(userId);
  const { isMessagesLoading, isMessagesSuccess, messages } = useGetMessages(
    activeId || ""
  );

  console.log(messages);
  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    setMessagesState(
      messages?.messages.sort(
        (a: Message, b: Message) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    );
  }, [isMessagesSuccess]);

  return (
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
              />
            ))
          )}
        </div>
      </div>
      <div className="bg-[#fdfdfd] py-4.5 rounded-[40px] flex flex-col h-[85vh]">
        {/* top section */}
        <div className=" flex flex-row pb-3 px-6 items-center gap-3.5 border-b  border-b-[#DBDBDB]">
          <div className="w-[52px] h-[52px] bg-[#368FFF] rounded-full"></div>
          {isMessagesSuccess && (
            <p className=" text-xl text-[#0c0c0c] font-medium">
              Chat with {messages?.messages[0]?.receiver.name}
            </p>
          )}
        </div>

        {/* chat messages area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {isMessagesLoading ? (
            <MessagesLoading />
          ) : (
            <div className="text-gray-500 text-center py-8">
              {isMessagesSuccess &&
                messagesState?.map((message: Message) => {
                  return (
                    <div
                      key={message.id}
                      className={`p-2 my-1 rounded-lg max-w-[70%] ${
                        message.senderId === activeId
                          ? "bg-blue-500 text-white self-end ml-auto"
                          : "bg-gray-200 text-black self-start mr-auto"
                      }`}
                    >
                      {message.content}
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* chat input */}
        <div className="px-6 py-4">
          <div className="flex gap-3 items-start ">
            <div className="flex-1 ">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full p-3 border border-[#DBDBDB] rounded-lg resize-none focus:outline-none focus:border-[#368FFF] h-[50px] leading-6"
                rows={1}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-[#368FFF] hover:bg-[#2574db] disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200 flex items-center justify-center w-[50px] h-[50px]"
            >
              <Send size={20} />
            </button>
          </div>
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
          className={`flex ${
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
