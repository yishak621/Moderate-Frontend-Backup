"use client";
import { useState } from "react";
import { SendHorizonal } from "lucide-react";

export default function MessageInput({
  onSend,
}: {
  onSend: (msg: string) => void;
}) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="w-full border-t  border-gray-200 p-3 flex items-center gap-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={(e) =>
          e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())
        }
        className="flex-1 bg-transparent resize-none outline-none p-2 rounded-md text-gray-900  placeholder-gray-400 "
        rows={1}
      />
      <button
        onClick={handleSend}
        className="cursor-pointer bg-blue-600 hover:bg-blue-700 transition p-2 rounded-lg text-white flex items-center justify-center"
      >
        <SendHorizonal size={20} />
      </button>
    </div>
  );
}
