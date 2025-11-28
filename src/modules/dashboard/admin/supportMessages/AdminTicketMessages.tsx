"use client";

import { useForm } from "react-hook-form";
import TicketMessage from "@/modules/dashboard/teacher/supportMessages/TicketMessage";
import {
  TicketMessagesProps,
  SendMessageTicketInput,
  Message,
} from "@/app/types/support_tickets";
import { RefreshCw, SendHorizonal, Mail, User, Shield } from "lucide-react";
import Textarea from "@/components/ui/Textarea";
import {
  usePostAdminMessage,
  useTicketMessages,
} from "@/hooks/useSupportTickets";
import toast from "react-hot-toast";
import Loading from "@/components/ui/Loading";
import { useMemo } from "react";

export default function AdminTicketMessages({ ticket }: TicketMessagesProps) {
  // Hooks
  const { messages, refetchMessages, isMessagesLoading } = useTicketMessages(
    ticket.id
  );
  const { sendAdminMessageAsync, isSendingAdminMessageLoading } =
    usePostAdminMessage();

  // React Hook Form
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<SendMessageTicketInput>();

  const onSubmit = async (data: SendMessageTicketInput) => {
    if (!data.message) return;

    try {
      await sendAdminMessageAsync({
        ticketId: ticket.id,
        message: data.message,
      });

      // Clear input
      setValue("message", "");

      // Revalidate messages
      refetchMessages();

      toast.success("Message sent successfully!");
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Something went wrong");
    }
  };

  const statusColors = useMemo(() => {
    return {
      closed: "bg-green-100 text-green-700 border-green-200",
      open: "bg-blue-100 text-blue-700 border-blue-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
  }, []);

  const statusColor = statusColors[ticket.status] || statusColors.open;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Modern Header with User Info */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="p-4 md:p-6 space-y-4">
          {/* User Info Section */}
          {ticket.user && (
            <div className="flex items-start gap-3 md:gap-4 pb-4 border-b border-gray-100">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                {ticket.user.profilePictureUrl ? (
                  <img
                    src={ticket.user.profilePictureUrl}
                    alt={ticket.user.name || "User"}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display =
                          "flex";
                      }
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center ${
                    ticket.user.profilePictureUrl ? "hidden" : "flex"
                  } bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md`}
                >
                  <User size={24} className="md:w-7 md:h-7" />
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base md:text-lg font-semibold text-[#0C0C0C] truncate">
                    {ticket.user.name || "Unknown User"}
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  {ticket.user.email && (
                    <div className="flex items-center gap-1.5 text-sm text-[#717171]">
                      <Mail size={14} className="flex-shrink-0" />
                      <span className="truncate">{ticket.user.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Ticket Subject and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-semibold text-[#0C0C0C] break-words leading-tight">
                {ticket.subject}
              </h2>
              {ticket.lastUpdated && (
                <p className="text-xs md:text-sm text-[#717171] mt-1">
                  Last updated: {ticket.lastUpdated}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold rounded-full border capitalize ${statusColor}`}
              >
                {ticket.status}
              </span>
              <button
                onClick={() => refetchMessages()}
                disabled={isMessagesLoading}
                className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Refresh messages"
              >
                <RefreshCw
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    isMessagesLoading ? "animate-spin" : ""
                  }`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {isMessagesLoading && !messages?.length ? (
            <div className="flex justify-center items-center h-full">
              <Loading text="Loading Messages..." />
            </div>
          ) : messages?.length ? (
            <div className="space-y-1">
              {messages.map((msg: Message) => (
                <TicketMessage
                  key={msg.id}
                  message={msg}
                  isAdminView={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Mail size={32} className="text-gray-400" />
              </div>
              <p className="text-[#0C0C0C] text-base md:text-lg font-medium">
                No messages yet
              </p>
              <p className="text-[#717171] text-sm mt-1 max-w-sm">
                Start the conversation by sending a message below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-shrink-0 border-t border-gray-200 bg-white p-4 md:p-6"
      >
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Textarea
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
              className="w-full bg-gray-50 border-gray-200 resize-none outline-none p-3 md:p-4 rounded-xl text-sm md:text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={3}
              {...register("message", { required: "Message is required!" })}
              error={errors?.message?.message}
              disabled={isSendingAdminMessageLoading || ticket.status === "closed"}
            />
          </div>
          <button
            type="submit"
            disabled={isSendingAdminMessageLoading || ticket.status === "closed"}
            className={`flex items-center justify-center p-3 md:p-4 rounded-xl text-white transition-all flex-shrink-0 shadow-sm ${
              isSendingAdminMessageLoading || ticket.status === "closed"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#368FFF] hover:bg-[#2574db] hover:shadow-md active:scale-95"
            }`}
            aria-label="Send message"
          >
            <SendHorizonal size={20} className="md:w-6 md:h-6" />
          </button>
        </div>
        {ticket.status === "closed" && (
          <p className="text-xs text-[#717171] mt-2 text-center">
            This ticket is closed. You cannot send new messages.
          </p>
        )}
      </form>
    </div>
  );
}

