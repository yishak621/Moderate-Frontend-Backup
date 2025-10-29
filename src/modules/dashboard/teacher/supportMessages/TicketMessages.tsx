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
    <div className="flex flex-col h-[80vh]">
      {/* Ticket Header */}
      <div className="flex flex-row gap-2 items-center border-b border-[#EDEDED] p-4">
        <h2 className="text-[#0C0C0C] text-xl font-semibold">
          {ticket?.subject}
        </h2>
        <div
          className={`px-4.5 py-2 text-sm font-semibold rounded-full ${
            {
              closed: "bg-green-100 text-green-700",
              open: "bg-[#368FFF]/10 text-[#368FFF]",
              pending: "bg-yellow-100 text-yellow-700",
            }[ticket.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {ticket.status.replace("_", " ")}
        </div>
        <div className=" self-end">
          <button
            onClick={() => refetchMessages()}
            disabled={isMessagesLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <RefreshCw
              className={`w-4 h-4 ${isMessagesLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto flex flex-col p-2 gap-2">
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
        className="w-full border-t border-gray-200 p-3 flex items-center gap-3"
      >
        <Textarea
          placeholder="Type your message..."
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), handleSubmit(onSubmit)())
          }
          className="flex-1 bg-transparent resize-none outline-none p-2 rounded-md text-gray-900 placeholder-gray-400"
          rows={1}
          {...register("message", { required: "Message is required!" })}
          error={errors?.message?.message}
          disabled={isSendingMessageLoading || ticket.status === "closed"}
        />
        <button
          type="submit"
          disabled={isSendingMessageLoading || ticket.status === "closed"}
          className={`flex items-center justify-center p-2 rounded-lg text-white transition ${
            isSendingMessageLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#368FFF] hover:bg-[#2574db]"
          }`}
        >
          <SendHorizonal size={20} />
        </button>
      </form>
    </div>
  );
}
