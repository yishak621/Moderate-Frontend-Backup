"use client";

import { useEffect, useState } from "react";
import { Plus, MessageCircle } from "lucide-react";

import TicketMessages from "@/modules/dashboard/teacher/supportMessages/TicketMessages";

import {
  useGetAllSupportTickets,
  useTicketMessages,
} from "@/hooks/useSupportTickets";
import Loading from "@/components/ui/Loading";
import { useSearchParams } from "next/navigation";

export default function SupportAdminMessagesClient() {
  const searchParams = useSearchParams();
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("ticketId");
    if (id) setTicketId(id);
  }, [searchParams]);

  const { messages, ticket, isMessagesLoading } = useTicketMessages(
    ticketId || ""
  );
  // const handleOpenModal = (
  //   component: React.FC<unknown>,
  //   props: unknown = {}
  // ) => {
  //   setModalComponent(() => component);
  //   setModalProps(props);
  //   setOpen(true);
  // };

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-[#FDFDFD] min-h-[90vh] rounded-[22px] p-8">
      {/* Right Section - Ticket Conversation */}
      <div className="flex-1 bg-[#FFFFFF] rounded-[22px]  ">
        {isMessagesLoading && (
          <div className="h-screen w-screen">
            <Loading text="Loading dashboard..." className="h-full" />
          </div>
        )}
        {ticket ? (
          <TicketMessages ticket={ticket} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-24">
            <MessageCircle
              size={46}
              className="text-[#BFBFBF] mb-4 opacity-80"
            />
            <p className="text-[#0C0C0C] text-lg font-medium">
              Select a ticket to view details
            </p>
            <p className="text-[#717171] text-sm font-normal mt-1 max-w-[320px]">
              View your messages, replies, and track progress from admins.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
