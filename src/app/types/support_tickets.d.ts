export interface Ticket {
  id: string;
  subject: string;
  status: "open" | "pending" | "closed";
  lastUpdated?: string;
  messages?: Message[];
  user?: {
    id: string;
    name?: string;
    email?: string;
    profilePictureUrl?: string | null;
  };
}
export interface Message {
  id: string;
  message: string;
  sender: string;
  createdAt?: string;
  senderInfo?: {
    id: string;
    name?: string;
    email?: string;
    profilePictureUrl?: string | null;
    role?: string;
  };
}

export interface TicketMessagesProps {
  ticket: Ticket;
}

export interface CreateTicketInput {
  email?: string;
  subject: string;
  message: string;
}

export interface SendMessageTicketInput {
  ticketId: string;
  message: string;
  sender: string;
}
