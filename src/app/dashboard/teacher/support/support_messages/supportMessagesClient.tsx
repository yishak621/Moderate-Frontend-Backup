"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Plus, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import NewTicketModal from "@/modules/dashboard/teacher/supportMessages/NewTicketModal";
import TicketMessages from "@/modules/dashboard/teacher/supportMessages/TicketMessages";
import { Badge } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import BottomSheet from "@/components/ui/BottomSheet";
import { Ticket } from "@/app/types/support_tickets";
import { useGetAllSupportTickets } from "@/hooks/useSupportTickets";
import Loading from "@/components/ui/Loading";

export default function SupportMessagesClient() {
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] = useState<React.FC<any> | null>(
    null
  );
  const [modalProps, setModalProps] = useState<any>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
    <div className="flex flex-col md:flex-row gap-3 md:gap-6 bg-[#FDFDFD] min-h-[90vh] rounded-xl md:rounded-[22px] p-3 md:p-8">
      {/* Mobile Header Back Button */}
      <div className="md:hidden -mt-1 -mx-1 mb-2 sticky top-0 z-20 bg-[#FDFDFD]">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
      </div>
      {/* Left Section - Tickets List */}
      <div className="md:w-1/3 bg-[#FFFFFF] border border-[#EDEDED] rounded-xl md:rounded-[22px] p-3 md:p-6 flex flex-col">
        {/* Header */}
        <div className="flex flex-row justify-between items-start sm:items-center mb-3 md:mb-6 gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[#0C0C0C] text-sm md:text-lg font-medium">
              Your Tickets
            </p>
            <p className="text-[#717171] text-[11px] md:text-sm font-normal">
              Track and manage your requests
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal(NewTicketModal)}
            className="flex items-center gap-1 bg-[#0560FD] hover:bg-[#004DE6] text-white rounded-[10px] px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium flex-shrink-0"
          >
            <Plus size={16} className="md:w-[18px] md:h-[18px]" />{" "}
            <span className="hidden sm:inline">New</span>
          </Button>
        </div>
        {isMobile ? (
          <BottomSheet
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Create Support Ticket"
          >
            <div className="p-4">
              {ModalComponent && <ModalComponent {...modalProps} />}
            </div>
          </BottomSheet>
        ) : (
          <Modal isOpen={open} onOpenChange={setOpen}>
            <Modal.Content>
              {ModalComponent && <ModalComponent {...modalProps} />}
            </Modal.Content>
          </Modal>
        )}
        {/* Tickets List */}
        <div className="flex flex-col gap-2 md:gap-3 overflow-y-auto">
          {isTicketsLoading && (
            <div className="flex-1">
              <Loading text="Loading Tickets.." />
            </div>
          )}
          {tickets?.tickets.map((ticket: Ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`p-2.5 md:p-4 rounded-[12px] md:rounded-[18px] cursor-pointer border transition-all ${
                selectedTicket?.id === ticket.id
                  ? "bg-[#F3F7FF] border-[#0560FD]"
                  : "bg-[#FAFAFA] border-[#EDEDED] hover:bg-[#F5F5F5]"
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[#0C0C0C] text-sm md:text-base font-medium break-words">
                    {ticket.subject}
                  </p>
                  <p className="text-[#9A9A9A] text-[10px] md:text-xs mt-0.5 break-all">
                    ID: {ticket.id}
                  </p>
                </div>
                <Badge
                  className={`text-[10px] md:text-xs capitalize flex-shrink-0 ${
                    ticket.status === "closed"
                      ? "bg-[#EAFEF1] text-[#1E874B]"
                      : ticket.status === "pending"
                      ? "bg-[#FFF9E6] text-[#E0A100]"
                      : "bg-[#F1F1F1] text-[#717171]"
                  }`}
                >
                  {ticket.status}
                </Badge>
              </div>
              <p className="text-[#717171] text-[10px] md:text-xs font-normal mt-1.5">
                Updated {ticket.lastUpdated}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Ticket Conversation */}
      <div className="flex-1 bg-[#FFFFFF] border border-[#EDEDED] rounded-xl md:rounded-[22px] p-3 md:p-8">
        {selectedTicket ? (
          <TicketMessages ticket={selectedTicket} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 md:py-24">
            <MessageCircle
              size={36}
              className="text-[#BFBFBF] mb-3 md:mb-4 opacity-80"
            />
            <p className="text-[#0C0C0C] text-sm md:text-lg font-medium">
              Select a ticket to view details
            </p>
            <p className="text-[#717171] text-xs md:text-sm font-normal mt-1 max-w-[280px] md:max-w-[320px]">
              View your messages, replies, and track progress from admins.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
