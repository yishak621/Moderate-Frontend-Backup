export type Threads = {
  partnerId: string;
  partnerName: string;
  senderName: string;
  lastMessage: string;
  lastMessageAt: string; // ISO date string
  messages: Message[];
  unreadCount: number;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string; // ISO date string
  sender?: {
    id: string;
    name: string;
  };
  receiver?: {
    id: string;
    name: string;
  };
};
