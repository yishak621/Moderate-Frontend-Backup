"use client";

import { useForm } from "react-hook-form";
import TicketMessage from "./TicketMessage";
import {
  TicketMessagesProps,
  SendMessageTicketInput,
  Message,
} from "@/app/types/support_tickets";
import { RefreshCw, SendHorizonal } from "lucide-react";
import Textarea from "@/components/ui/Textarea";
import { decoded } from "@/lib/currentUser";
import {
  usePostSupportMessage,
  useTicketMessages,
} from "@/hooks/useSupportTickets";
import toast from "react-hot-toast";
import Loading from "@/components/ui/Loading";

export default function TicketMessages({ ticket }: TicketMessagesProps) {
  const thisMessageSender = decoded?.role === "TEACHER" ? "user" : "admin";

  // Hooks
  const { messages, refetchMessages, isMessagesLoading } = useTicketMessages(
    ticket.id
  );
  const { sendMessageAsync, isSendingMessageLoading } = usePostSupportMessage();

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
      await sendMessageAsync({
        ...data,
        ticketId: ticket.id,
        sender: thisMessageSender,
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

  return (
    <div className="flex flex-col h-[75vh] md:h-[80vh]">
      {/* Ticket Header */}
      <div className="flex flex-wrap gap-2 items-start border-b border-[#EDEDED] p-2.5 md:p-4 sticky top-0 bg-white z-10">
        <div className="flex-1 min-w-0">
          <h2 className="text-[#0C0C0C] text-sm md:text-xl font-semibold break-words leading-tight">
            {ticket?.subject}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          <div
            className={`px-2 md:px-4.5 py-1 md:py-2 text-[10px] md:text-sm font-semibold rounded-full whitespace-nowrap ${
              {
                closed: "bg-green-100 text-green-700",
                open: "bg-[#368FFF]/10 text-[#368FFF]",
                pending: "bg-yellow-100 text-yellow-700",
              }[ticket.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {ticket.status.replace("_", " ")}
          </div>
          <button
            onClick={() => refetchMessages()}
            disabled={isMessagesLoading}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
                isMessagesLoading ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto flex flex-col p-2 md:p-3 gap-1.5 md:gap-2">
          {isMessagesLoading && (
            <div className="flex justify-center items-center h-full">
              <Loading text="Loading Messages..." />
            </div>
          )}
          {messages?.map((msg: Message) => (
            <TicketMessage
              key={msg.id}
              message={msg.message}
              sender={msg.sender}
            />
          ))}
        </div>
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full border-t border-gray-200 p-2 md:p-3 flex items-center gap-2 md:gap-3 sticky bottom-0 bg-white"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
        }}
      >
        <Textarea
          placeholder="Type your message..."
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), handleSubmit(onSubmit)())
          }
          className="flex-1 bg-transparent resize-none outline-none p-1.5 md:p-2 rounded-md text-sm md:text-base text-gray-900 placeholder-gray-400"
          rows={1}
          {...register("message", { required: "Message is required!" })}
          error={errors?.message?.message}
          disabled={isSendingMessageLoading || ticket.status === "closed"}
        />
        <button
          type="submit"
          disabled={isSendingMessageLoading || ticket.status === "closed"}
          className={`flex items-center justify-center p-2 md:p-3 rounded-lg text-white transition flex-shrink-0 ${
            isSendingMessageLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#368FFF] hover:bg-[#2574db]"
          }`}
        >
          <SendHorizonal size={16} className="md:w-5 md:h-5" />
        </button>
      </form>
    </div>
  );
}
