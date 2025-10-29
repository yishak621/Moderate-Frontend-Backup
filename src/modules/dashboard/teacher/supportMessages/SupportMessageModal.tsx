"use client";

import React, { useState } from "react";
import { useCreateSupportTicket } from "@/hooks/useSupportTickets";

export default function SupportForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const {
    createTicket,
    isCreatingTicketLoading,
    isCreatingTicketSuccess,
    isCreatingTicketError,
    creatingTicketError,
  } = useCreateSupportTicket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    createTicket({ subject, message });
    setSubject("");
    setMessage("");
  };

  return (
    <div className=" bg-[#FDFDFD] min-w-[551px] p-10 rounded-[27px] flex flex-col">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 ">
        Contact Support
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block mb-1 font-medium text-gray-700"
          >
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            id="subject"
            type="text"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block mb-1 font-medium text-gray-700"
          >
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400  resize-none"
            required
          />
        </div>

        {/* Feedback */}
        {isCreatingTicketError && (
          <p className="text-red-500">{creatingTicketError?.message}</p>
        )}
        {isCreatingTicketSuccess && (
          <p className="text-green-500">Message sent successfully!</p>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setSubject("");
              setMessage("");
            }}
            className="px-4 py-2 rounded-lg border text-gray-700  hover:bg-gray-100 "
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isCreatingTicketLoading}
            className="px-4 py-2 rounded-lg bg-[#368FFF] text-white hover:bg-[#2574db] disabled:opacity-50"
          >
            {isCreatingTicketLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
