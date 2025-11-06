"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useModal } from "@/components/ui/Modal";
import BottomSheet, { useBottomSheet } from "@/components/ui/BottomSheet";
import { useCreateSupportTicket } from "@/hooks/useSupportTickets";
import { CreateTicketInput, Ticket } from "@/app/types/support_tickets";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function NewTicketModal() {
  const modalCtx = useModal();
  const sheetCtx = useBottomSheet();
  const close = sheetCtx?.isOpen ? sheetCtx.close : modalCtx.close;
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { createTicket, createTicketAsync, isCreatingTicketLoading } =
    useCreateSupportTicket();

  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
    setValue,
  } = useForm<CreateTicketInput>();

  //   const handleSubmit = async () => {
  //     if (!subject.trim() || !message.trim()) return;
  //     await createTicket({ subject, message });
  //     close();
  //   };
  const onSubmit = async (data: CreateTicketInput) => {
    try {
      await createTicketAsync(data);
      toast.success("Support ticket created successfully!");
      close();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        toast.error(err.message);
      } else {
        console.error("Unknown error", err);
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <div className="bg-[#FDFDFD] w-full max-w-[600px] mx-auto p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex flex-row justify-between mb-4 md:mb-6">
        <div className="flex flex-col gap-1.5">
          <p className="hidden md:block text-lg md:text-xl text-[#0c0c0c] font-medium">
            Create Support Ticket
          </p>
          <p className="text-sm md:text-base font-normal text-[#717171]">
            Describe your issue and our team will respond soon.
          </p>
        </div>

        <div className="hidden md:block" onClick={close}>
          <X width={20} height={20} className="text-[#000000] cursor-pointer" />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 md:gap-4"
      >
        <Input
          placeholder="Subject"
          className="border border-[#E3E3E3] rounded-[12px] p-3 text-sm"
          {...register("subject", { required: "Subject is required!" })}
          error={errors?.subject?.message}
        />
        <Textarea
          placeholder="Write your message..."
          rows={6}
          className="border border-[#E3E3E3] rounded-[12px] p-3 text-sm resize-none"
          {...register("message", { required: "Message is required!" })}
          error={errors?.message?.message}
        />

        {/* Update Button */}
        <Button
          type="submit"
          className={`justify-center h-11 md:h-12 text-sm md:text-base w-full transition
    ${
      isCreatingTicketLoading
        ? "opacity-70 cursor-not-allowed"
        : "cursor-pointer"
    }`}
          disabled={isCreatingTicketLoading}
        >
          {isCreatingTicketLoading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Ticket"
          )}
        </Button>
      </form>
    </div>
  );
}
