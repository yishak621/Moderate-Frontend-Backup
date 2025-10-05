import { User } from "@/app/types/user";

export type AuditAction =
  | "document-upload"
  | "document-download"
  | "system-grade-new"
  | "profile-update"
  | "login"
  | "logout";

export interface UserAuditLog {
  id: number;
  action: AuditAction;
  description: string;
  createdAt: string; // ISO timestamp
}

export interface SubjectDomain {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AllowedEmailDomainAttributes {
  id: string;
  name: string;
  category?: string | null;
  emailDomain?: string | null;
  website?: string | null;
  otherInfo1?: string | null;
  otherInfo2?: string | null;
  otherInfo3?: string | null;
  otherInfo4?: string | null;
  otherInfo5?: string | null;
  otherInfo6?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  teachers?: string;
  status?: "active" | "inactive";
}

export enum AnnouncementStatus {
  Draft = "draft",
  Published = "published",
  Archived = "archived",
}

export interface AnnouncementAttributes {
  id?: string;
  title: string;
  content: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: AnnouncementStatus;
}
