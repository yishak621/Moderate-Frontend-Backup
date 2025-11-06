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
    <div className="bg-[#FDFDFD] w-full max-w-[600px] mx-auto p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-[27px] flex flex-col">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-900 ">
        Contact Support
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block mb-1 font-medium text-gray-700 text-sm md:text-base"
          >
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            id="subject"
            type="text"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 md:px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 text-sm md:text-base"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block mb-1 font-medium text-gray-700 text-sm md:text-base"
          >
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 px-3 md:px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 resize-none text-sm md:text-base"
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
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setSubject("");
              setMessage("");
            }}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 w-full sm:w-auto"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isCreatingTicketLoading}
            className="px-4 py-2 rounded-lg bg-[#368FFF] text-white hover:bg-[#2574db] disabled:opacity-50 w-full sm:w-auto"
          >
            {isCreatingTicketLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
