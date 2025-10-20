export type Threads = {
  partnerId: string;
  partnerName: string;
  senderName: string;
  lastMessage: string;
  lastMessageAt: string; // ISO date string
  messages: Message[];
  unreadCount: number;
};

export interface Thread {
  partnerId: string;
  partnerName: string;
  lastMessage: string;
  unreadCount: number;
}
export type Message = {
  id: string;
  senderId: string;
  receiverId?: string | undefined;
  pending?: boolean;
  content: string;
  createdAt?: string | null; // ISO date string
  sender?: {
    id: string;
    name: string;
  };
  receiver?: {
    id: string;
    name: string;
  };
};
