export interface Announcement {
  title: string;
  content?: string;
  type:
    | "Announcement"
    | "Newsletter"
    | "System Alert"
    | "Marketing"
    | "Report"
    | string;
  priority: "High" | "Medium" | "Low";
  audience: string;
  status: "Draft" | "Scheduled" | "Published" | string;
  views: number;
  published: string | null; // ISO date string or null if not published
}
