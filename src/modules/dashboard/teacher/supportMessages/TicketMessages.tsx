"use client";

import { useForm } from "react-hook-form";
import TicketMessage from "./TicketMessage";
import {
  TicketMessagesProps,
  SendMessageTicketInput,
  Message,
} from "@/app/types/support_tickets";
import { SendHorizonal } from "lucide-react";
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
    <div className="flex flex-col h-full">
      {/* Ticket Header */}
      <div className="mb-6 border-b border-[#EDEDED] pb-4">
        <h2 className="text-[#0C0C0C] text-xl font-semibold">
          {ticket?.subject}
        </h2>
        <p className="text-[#717171] text-sm mt-1">
          {ticket.status.replace("_", " ")}
        </p>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4">
        {isMessagesLoading && (
          <div className="flex-1">
            <Loading text="Loading Messages..." />
          </div>
        )}{" "}
        {messages?.map((msg: Message) => (
          <TicketMessage
            key={msg.id}
            message={msg.message}
            sender={msg.sender}
          />
        ))}
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
          disabled={isSendingMessageLoading}
        />
        <button
          type="submit"
          disabled={isSendingMessageLoading}
          className={`flex items-center justify-center p-2 rounded-lg text-white transition ${
            isSendingMessageLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <SendHorizonal size={20} />
        </button>
      </form>
    </div>
  );
}
