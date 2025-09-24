"use client";

import { LucideIcon } from "lucide-react";
import React from "react";

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  subheader?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon: Icon,
  subheader,
}) => {
  return (
    <div className=" flex flex-col gap-1.5">
      <div className="flex flex-row items-center gap-2">
        {Icon && <Icon size={22} className="text-[#0C0C0C]" />}
        <h4 className="text-[#0C0C0C] text-xl font-medium">{title}</h4>
      </div>
      <p className=" text-[16px] text-[#717171] font-normal">{subheader}</p>
    </div>
  );
};

export default SectionHeader;
