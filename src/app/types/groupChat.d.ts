export interface GroupMember {
  id: string;
  conversationId: string;
  userId: string;
  role: "admin" | "member";
  user: {
    id: string;
    name: string;
    email?: string;
    profilePictureUrl?: string | null;
  };
}

export interface GroupConversation {
  id: string;
  name: string;
  type: "group" | "direct";
  createdBy: string;
  members: GroupMember[];
  messages?: GroupMessage[];
  lastMessage?: GroupMessage;
  unreadCount?: number;
}

export interface GroupMessage {
  id: string;
  conversationId?: string;
  senderId: string;
  receiverId?: string | null;
  postId?: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    profilePictureUrl?: string | null;
  };
}

export interface CreateGroupInput {
  name: string;
  memberIds: string[];
}

export interface AddMembersInput {
  memberIds: string[];
}

