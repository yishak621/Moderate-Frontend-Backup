import { User } from "./user";

export interface Support {
  id: string;
  subject: string;
  user: User;
  type: "System" | "General" | "Feature";
  status: "Opened" | "Resolved" | "In_progress";
  messages: number;
  last_reply: string;
  created: Date;
}
