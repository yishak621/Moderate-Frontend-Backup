import { Domain } from "./user";

export type Priority = "High" | "Medium" | "Low";
export type AnnouncementStatus = "Draft" | "Scheduled" | "Published";

export interface Announcement {
  id: string;
  title: string;
  content?: string;
  type?: string[];
  priority: Priority;
  domainIDs: string;
  domains: Domain[];
  status: AnnouncementStatus | string;
  views: number;
  published?: string | null; // ISO date string or null
  startDate?: Date | null | undefined; // Keep as string for consistent API serialization
  expireDate?: Date | null | undefined;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;

  createdBy?: string;
}
