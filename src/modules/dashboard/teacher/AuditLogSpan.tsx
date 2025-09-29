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
    <div className="flex flex-row justify-between gap-3 py-2 pb-[26px] border-b border-b-[#DBDBDB] hover:bg-gray-50 cursor-pointer">
      <div className="flex flex-row items-center">
        {" "}
        <StatusCircle color={circleColor} />
        <p className="text-[#0c0c0c] text-base font-normal capitalize ml-3">
          {type}
        </p>
        <p className="text-[#717171] text-sm font-normal truncate capitalize ml-[40px]">
          {content}
        </p>
      </div>
      <p className=" text-[#0c0c0c] text-base font-normal">{createdAt}</p>
    </div>
  );
}
