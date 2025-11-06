"use client";

import { useState } from "react";
import remarkGfm from "remark-gfm";
import { ChevronDownIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
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
    <div className="flex flex-col border-b pb-4 sm:pb-5 border-[#E5E5E5]">
      <button
        onClick={onClick}
        className="flex flex-row justify-between items-center w-full text-left group cursor-pointer py-2"
      >
        <p className="text-sm sm:text-base font-medium text-[#0c0c0c] group-hover:text-[#368FFF] transition-colors">
          {title}
        </p>
        <ChevronDownIcon
          size={20}
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#368FFF]" : "rotate-0 text-[#717171]"
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-96 opacity-100 mt-2 sm:mt-3"
            : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="mt-1 sm:mt-2 space-y-1.5 sm:space-y-2">
          {content.split("\n").map((line, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="mt-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
              <p className="text-[13px] sm:text-sm text-[#717171] leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {line}
                </ReactMarkdown>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
