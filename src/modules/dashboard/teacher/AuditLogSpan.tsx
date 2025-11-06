import StatusCircle from "./StatusCircle";

interface AuditLogSpanProps {
  type: string;
  content: string;
  createdAt: string;
}

export function AuditLogSpan({ type, content, createdAt }: AuditLogSpanProps) {
  // Map action types to colors
  const circleColorMap: Record<string, string> = {
    "system-grade-new": "bg-blue-500",
    "document-upload": "bg-green-500",
    "document-download": "bg-yellow-500",
    "profile-update": "bg-purple-500",
    login: "bg-teal-500",
    logout: "bg-red-500",
  };

  const circleColor = circleColorMap[type] || "bg-gray-400";

  return (
    <div className="flex flex-row justify-between gap-2 sm:gap-3 py-2 sm:py-2 pb-4 sm:pb-[26px] border-b border-b-[#DBDBDB] hover:bg-gray-50 cursor-pointer">
      <div className="flex flex-row items-center gap-2 sm:gap-0 flex-1 min-w-0">
        <div className="flex items-center justify-center flex-shrink-0">
          <StatusCircle color={circleColor} />
        </div>
        <div className="flex flex-row items-center gap-1 sm:gap-0 flex-1 min-w-0">
          <p className="text-[#0c0c0c] text-sm sm:text-base font-normal capitalize ml-1 sm:ml-3 flex-shrink-0">
            {type.replace(/-/g, " ")}
          </p>
          <p className="text-[#717171] text-xs sm:text-sm font-normal truncate capitalize ml-2 sm:ml-6 md:ml-[40px]">
            {content}
          </p>
        </div>
      </div>
      <p className="text-[#0c0c0c] text-xs sm:text-base font-normal flex-shrink-0">
        {new Date(createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
