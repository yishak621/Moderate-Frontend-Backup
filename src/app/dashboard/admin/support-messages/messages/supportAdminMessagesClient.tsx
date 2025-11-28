"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

import AdminTicketMessages from "@/modules/dashboard/admin/supportMessages/AdminTicketMessages";

import { useTicketMessages } from "@/hooks/useSupportTickets";
import Loading from "@/components/ui/Loading";
import { useSearchParams } from "next/navigation";

export default function SupportAdminMessagesClient() {
  const searchParams = useSearchParams();
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("ticketId");
    if (id) setTicketId(id);
  }, [searchParams]);

  const { ticket, isMessagesLoading } = useTicketMessages(ticketId || "");

  return (
    <div className="flex flex-col gap-6 bg-[#FDFDFD] min-h-[90vh] rounded-[22px] p-4 md:p-8">
      {/* Ticket Conversation */}
      <div className="flex-1 bg-[#FFFFFF] rounded-[22px] border border-gray-200 shadow-sm overflow-hidden">
        {isMessagesLoading && !ticket ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Loading text="Loading ticket..." />
          </div>
        ) : ticket ? (
          <AdminTicketMessages ticket={ticket} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center py-24 px-4">
            <MessageCircle
              size={56}
              className="text-[#BFBFBF] mb-4 opacity-80"
            />
            <p className="text-[#0C0C0C] text-lg md:text-xl font-medium">
              No ticket selected
            </p>
            <p className="text-[#717171] text-sm md:text-base font-normal mt-2 max-w-md">
              Select a ticket from the support messages page to view and respond to messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
