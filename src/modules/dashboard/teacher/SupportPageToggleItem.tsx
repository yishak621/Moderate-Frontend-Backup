"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

interface SupportClientTeachersProps {
  title: string;
  content: string;
}

export default function SupportPageToggleItem({
  title,
  content,
  isOpen,
  onClick,
}: SupportClientTeachersProps & { isOpen: boolean; onClick: () => void }) {
  return (
    <div className="flex flex-col border-b pb-5 border-[#E5E5E5] ">
      <button
        onClick={onClick}
        className="flex flex-row justify-between items-center w-full text-left group cursor-pointer"
      >
        <p className="text-base font-medium text-[#0c0c0c] group-hover:text-[#368FFF] transition-colors">
          {title}
        </p>
        <ChevronDownIcon
          size={24}
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#368FFF]" : "rotate-0 text-[#717171]"
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <p className="text-sm font-normal text-[#717171]">{content}</p>
      </div>
    </div>
  );
}
