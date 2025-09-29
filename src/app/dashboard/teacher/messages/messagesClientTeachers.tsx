"use client";

import { ThreadBox } from "@/modules/dashboard/teacher/ThreadBox";
import { useState } from "react";
import { Send } from "lucide-react";

const sampleThreads = [
  {
    name: "Yisahk A.",
    unreadCount: 8,
    lastMessage: "this is the last message",
    isActive: true,
  },
  {
    name: "Ermi A.",
    unreadCount: 8,
    lastMessage: "this is the last message",
  },
  {
    name: "Mahi K.",
    unreadCount: 8,
    lastMessage: "this is the last message",
  },
  {
    name: "jHonasd A.",
    unreadCount: 8,
    lastMessage: "this is the last message",
  },
];

export default function MessagesClientTeachers() {
  const [message, setMessage] = useState("");

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

  return (
    <div className=" grid grid-cols-1 md:grid-cols-[25%_75%] gap-4">
      <div className="bg-[#FDFDFD] rounded-[22px] py-6 px-7 min-h-screen flex flex-col">
        <h4 className="text-[#0C0C0C] text-xl font-medium mb-5">Inbox</h4>

        <div className=" flex flex-col gap-3">
          {sampleThreads.map((thread, idx) => {
            return (
              <ThreadBox
                key={idx}
                name={thread.name}
                unreadCount={thread.unreadCount}
                lastMessage={thread.lastMessage}
                isActive={thread.isActive}
              />
            );
          })}
        </div>
      </div>
      <div className="bg-[#fdfdfd] py-4.5 rounded-[40px] flex flex-col h-screen">
        {/* top section */}
        <div className=" flex flex-row pb-3 px-6 items-center gap-3.5 border-b  border-b-[#DBDBDB]">
          <div className="w-[52px] h-[52px] bg-[#368FFF] rounded-full"></div>
          <p className=" text-xl text-[#0c0c0c] font-medium">
            Chat with Sarah Johnson
          </p>
        </div>

        {/* chat messages area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="text-gray-500 text-center py-8">
            Chat room - Messages will appear here
          </div>
        </div>

        {/* chat input */}
        <div className="px-6 py-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
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
