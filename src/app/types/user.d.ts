export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  curricular?: string;
  status?: "Active" | "Suspended" | "Inactive";
  subscription?: "free" | "Monthly" | "Yearly";
  lastActive?: string;
}
