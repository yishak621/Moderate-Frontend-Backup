import { User } from "./user";

export interface Support {
  id: string;
  subject: string;
  user: User;
  userId: string;
  type: "System" | "General" | "Feature";
  status: "opened" | "closed" | "pending";
  messages: number;
  lastMessageAt: string;
  createdAt: string;
}
