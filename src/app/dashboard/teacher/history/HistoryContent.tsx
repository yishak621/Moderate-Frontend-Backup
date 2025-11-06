"use client";

import { AuditLogSpan } from "@/modules/dashboard/teacher/AuditLogSpan";
import { UserAuditLog } from "@/types/typeLog";

export const sampleUserAuditLogs: UserAuditLog[] = [
  {
    id: 1,
    action: "system-grade-new",
    description: "New grading scale applied to your uploaded Math assignments.",
    createdAt: "2025-09-20T10:45:00Z",
  },
  {
    id: 2,
    action: "document-upload",
    description: "Uploaded 'Physics Lab Report.pdf'.",
    createdAt: "2025-09-21T14:20:00Z",
  },
  {
    id: 3,
    action: "system-grade-new",
    description: "Grades recalculated for your Science 202 assignments.",
    createdAt: "2025-09-22T09:15:00Z",
  },
  {
    id: 4,
    action: "profile-update",
    description: "Updated your profile information.",
    createdAt: "2025-09-23T16:00:00Z",
  },
  {
    id: 5,
    action: "document-download",
    description: "Downloaded 'English Essay.docx'.",
    createdAt: "2025-09-24T11:30:00Z",
  },
];

export default function HistoryContent() {
  return (
    <div className="flex flex-col mb-8 sm:mb-12 md:mb-[54px] py-4 px-4 sm:py-5 sm:px-6 md:py-6 md:px-7 min-h-screen bg-[#FDFDFD] rounded-2xl sm:rounded-3xl md:rounded-[40px]">
      <h4 className="text-lg sm:text-xl md:text-xl font-medium text-[#0c0c0c] mb-6 sm:mb-8 md:mb-[54px]">
        Audit Log
      </h4>
      {/* Logs */}
      <div className="flex flex-col rounded-lg overflow-hidden">
        {sampleUserAuditLogs.map((log) => (
          <AuditLogSpan
            key={log.id}
            type={log.action}
            content={log.description}
            createdAt={log.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
