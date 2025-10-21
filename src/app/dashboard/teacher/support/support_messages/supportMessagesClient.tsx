"use client";

import { useState } from "react";
import { Plus, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import NewTicketModal from "@/modules/dashboard/teacher/supportMessages/NewTicketModal";
import TicketMessages from "@/modules/dashboard/teacher/supportMessages/TicketMessages";
import { Badge } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Ticket } from "@/app/types/support_tickets";
import { useGetAllSupportTickets } from "@/hooks/useSupportTickets";
import Loading from "@/components/ui/Loading";

// interface Ticket {
//   id: string;
//   subject: string;
//   status: "open" | "in_progress" | "resolved";
//   lastUpdated: string;
// }

// const mockTickets: Ticket[] = [
//   {
//     id: "1",
//     subject: "App not loading on desktop",
//     status: "in_progress",
//     lastUpdated: "2025-10-20",
//   },
//   {
//     id: "2",
//     subject: "Payment not reflected",
//     status: "resolved",
//     lastUpdated: "2025-10-18",
//   },
// ];

export default function SupportMessagesClient() {
  //   const [tickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] = useState<React.FC<any> | null>(
    null
  );
  const [modalProps, setModalProps] = useState<any>({});

  //HOOKS
  const { tickets, isTicketsLoading } = useGetAllSupportTickets();

  const handleOpenModal = (
    component: React.FC<unknown>,
    props: unknown = {}
  ) => {
    setModalComponent(() => component);
    setModalProps(props);
    setOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-[#FDFDFD] min-h-[90vh] rounded-[22px] p-8">
      {/* Left Section - Tickets List */}
      <div className="md:w-1/3 bg-[#FFFFFF] border border-[#EDEDED] rounded-[22px] p-6 flex flex-col ">
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-6">
          <div>
            <p className="text-[#0C0C0C] text-lg font-medium">Your Tickets</p>
            <p className="text-[#717171] text-sm font-normal">
              Track and manage your requests
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal(NewTicketModal)}
            className="flex items-center gap-1 bg-[#0560FD] hover:bg-[#004DE6] text-white rounded-[10px] px-4 py-2 text-sm font-medium"
          >
            <Plus size={18} /> New
          </Button>
        </div>
        <Modal isOpen={open} onOpenChange={setOpen}>
          <Modal.Content>
            {ModalComponent && <ModalComponent {...modalProps} />}
          </Modal.Content>
        </Modal>
        {/* Tickets List */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {isTicketsLoading && (
            <div className="flex-1">
              <Loading text="Loading Tickets.." />
            </div>
          )}
          {tickets?.tickets.map((ticket: Ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`p-4 rounded-[18px] cursor-pointer border transition-all ${
                selectedTicket?.id === ticket.id
                  ? "bg-[#F3F7FF] border-[#0560FD]"
                  : "bg-[#FAFAFA] border-[#EDEDED] hover:bg-[#F5F5F5]"
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="text-[#0C0C0C] text-sm font-medium truncate">
                  {ticket.subject}
                </p>
                <Badge
                  className={`text-xs capitalize ${
                    ticket.status === "resolved"
                      ? "bg-[#EAFEF1] text-[#1E874B]"
                      : ticket.status === "in_progress"
                      ? "bg-[#FFF9E6] text-[#E0A100]"
                      : "bg-[#F1F1F1] text-[#717171]"
                  }`}
                >
                  {ticket.status}
                </Badge>
              </div>
              <p className="text-[#717171] text-xs font-normal mt-1">
                Updated {ticket.lastUpdated}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Ticket Conversation */}
      <div className="flex-1 bg-[#FFFFFF] border border-[#EDEDED] rounded-[22px]  p-8">
        {selectedTicket ? (
          <TicketMessages ticket={selectedTicket} />
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

      {/* Modal for Creating Ticket */}
      {showNewTicket && <NewTicketModal />}
    </div>
  );
}
