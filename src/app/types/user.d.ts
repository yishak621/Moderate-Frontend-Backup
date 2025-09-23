export interface User {
  id: string;
  name: string;
  email: string;
  curricular: string;
  status: "Active" | "Suspended" | "Inactive";
  subscription: "free" | "Monthly" | "Yearly";
  lastActive: string;
}
