// NotificationItem.tsx
import React from "react";
import StatusCircle from "../StatusCircleProps";

interface NotificationItemProps {
  statusColor?: string;
  title: string;
  time: string;
  circleSize?: number;
}

const DashboardNotificationItem: React.FC<NotificationItemProps> = ({
  statusColor = "bg-red-600",
  title,
  time,
  circleSize = 10,
}) => {
  return (
    <div className="flex flex-row gap-3 items-start ">
      <div className="flex justify-center items-center w-[25px] h-[25px]">
        <StatusCircle color={statusColor} size={circleSize} />
      </div>
      <div className="flex flex-col justify-start items-start gap-1.5">
        <p className="text-base font-normal text-[#0C0C0C]">{title}</p>
        <p className="text-[#717171] text-base font-medium">{time}</p>
      </div>
    </div>
  );
};

export default DashboardNotificationItem;
