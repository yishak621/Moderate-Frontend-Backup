"use client";

import { User, Shield } from "lucide-react";
import { Message } from "@/app/types/support_tickets";
import { decoded } from "@/lib/currentUser";

interface TicketMessageProps {
  message: Message;
  isAdminView?: boolean;
}

export default function TicketMessage({
  message,
  isAdminView = false,
}: TicketMessageProps) {
  const isUser = message.sender === "user";
  const isAdmin = message.sender === "admin";
  const currentUserIsAdmin = decoded?.role === "SYSTEM_ADMIN" || decoded?.role === "ADMIN";
  
  // Show email only for admin view and only for user messages (not admin messages)
  // Never show admin email to regular users (when viewing as user)
  // isAdminView = true means admin is viewing, so show user email
  // isAdminView = false means user is viewing, so never show admin email
  const showEmail = isAdminView && isUser && message.senderInfo?.email;
  const showName = message.senderInfo?.name;
  const profilePicture = message.senderInfo?.profilePictureUrl;
  const senderName = showName || (isUser ? "User" : "Admin");

  return (
    <div
      className={`flex gap-2 md:gap-3 mt-2 md:mt-3 ${
        isUser ? "justify-end" : "justify-start"
      } w-full`}
    >
      {/* Profile Picture - Only show on left side (admin messages) */}
      {!isUser && (
        <div className="flex-shrink-0">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={senderName}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = "flex";
                }
              }}
            />
          ) : null}
          <div
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
              profilePicture ? "hidden" : "flex"
            } ${
              isAdmin
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isAdmin ? (
              <Shield size={16} className="md:w-5 md:h-5" />
            ) : (
              <User size={16} className="md:w-5 md:h-5" />
            )}
          </div>
        </div>
      )}

      {/* Message Content */}
      <div
        className={`flex flex-col gap-1 max-w-[85%] md:max-w-[70%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {/* Sender Info - Only show for admin messages or when viewing as admin */}
        {(!isUser || isAdminView) && (
          <div
            className={`flex items-center gap-1.5 md:gap-2 px-1 ${
              isUser ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <span className="text-[11px] md:text-xs font-medium text-[#0C0C0C]">
              {senderName}
            </span>
            {showEmail && (
              <span className="text-[10px] md:text-xs text-[#717171]">
                ({message.senderInfo?.email})
              </span>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`px-3 md:px-4 py-2 md:py-2.5 rounded-2xl text-[13px] md:text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-[#368FFF] text-white rounded-br-md"
              : "bg-gray-100 text-[#0C0C0C] rounded-bl-md"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.message}</p>
        </div>

        {/* Timestamp */}
        {message.createdAt && (
          <span
            className={`text-[10px] md:text-xs text-[#9A9A9A] px-1 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {new Date(message.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      {/* Profile Picture - Only show on right side (user messages) */}
      {isUser && (
        <div className="flex-shrink-0">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={senderName}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = "flex";
                }
              }}
            />
          ) : null}
          <div
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
              profilePicture ? "hidden" : "flex"
            } bg-[#368FFF] text-white`}
          >
            <User size={16} className="md:w-5 md:h-5" />
          </div>
        </div>
      )}
    </div>
  );
}
