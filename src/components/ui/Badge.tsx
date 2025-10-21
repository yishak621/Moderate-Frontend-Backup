"use client";

import React from "react";
import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className,
}) => {
  const baseStyle =
    "inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-[10px] capitalize";

  const variants = {
    default: "bg-[#0560FD]/10 text-[#0560FD]",
    secondary: "bg-[#F1F1F1] text-[#717171]",
    success: "bg-[#EAFEF1] text-[#1E874B]",
    warning: "bg-[#FFF9E6] text-[#E0A100]",
    danger: "bg-[#FFECEC] text-[#D91E18]",
  };

  return (
    <span className={clsx(baseStyle, variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
