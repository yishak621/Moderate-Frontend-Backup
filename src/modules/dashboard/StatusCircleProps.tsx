// StatusCircle.tsx
"use client";
import React from "react";

interface StatusCircleProps {
  color?: string; // Tailwind color or hex
  size?: number; // diameter in px
}

const StatusCircle: React.FC<StatusCircleProps> = ({
  color = "bg-red-600",
  size = 10,
}) => {
  return (
    <div
      className={`${color} rounded-full`}
      style={{ width: size, height: size }}
    />
  );
};

export default StatusCircle;
