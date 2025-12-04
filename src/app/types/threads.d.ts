export type Threads = {
  partnerId: string;
  partnerName: string;
  senderName: string;
  lastMessage: string;
  lastMessageAt: string; // ISO date string
  messages: Message[];
  unreadCount: number;
  partnerProfilePicture: string | null;
  senderProfilePicture: string | null;
  isBlocked?: boolean; // You blocked them
  isBlockedByThem?: boolean; // They blocked you
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
  conversationId?: string | undefined;
  pending?: boolean;
  failed?: boolean;
  content: string;
  createdAt?: string | null; // ISO date string
  sender?: {
    id: string;
    name: string;
    profilePictureUrl?: string | null;
  };
  receiver?: {
    id: string;
    name: string;
  };
};
