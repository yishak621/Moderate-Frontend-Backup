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
    <div className="flex flex-col items-center md:items-start  gap-1 sm:gap-1.5">
      <div className="flex flex-row items-center gap-1.5 sm:gap-2">
        {Icon && (
          <Icon
            size={18}
            className="sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px] text-[#0C0C0C]"
          />
        )}
        <h4 className="text-[#0C0C0C] text-base sm:text-lg md:text-xl font-medium">
          {title}
        </h4>
      </div>
      {subheader && (
        <p className="text-sm sm:text-[15px] md:text-[16px] text-[#717171] font-normal leading-relaxed">
          {subheader}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
