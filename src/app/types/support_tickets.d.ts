export interface Ticket {
  id: string;
  subject: string;
  status: "open" | "pending" | "closed";
  lastUpdated?: string;
  messages?: Message[];
}
export interface Message {
  id: string;
  message: string;
  sender: string;
}

export interface TicketMessagesProps {
  ticket: Ticket;
}

export interface CreateTicketInput {
  subject: string;
  message: string;
}

export interface SendMessageTicketInput {
  ticketId: string;
  message: string;
  sender: string;
}
