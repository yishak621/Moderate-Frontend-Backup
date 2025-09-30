// types/auditLog.ts
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
