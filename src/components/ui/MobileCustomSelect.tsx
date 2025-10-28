"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface MobileCustomSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MobileCustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}: MobileCustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Select Button - Mobile Optimized */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between gap-2
          px-3 py-2
          bg-white border border-gray-300 rounded-lg
          text-sm font-normal text-gray-900
          hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
        "
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Options - Mobile Optimized */}
      {isOpen && (
        <div
          className="
          absolute top-full left-0 right-0 mt-1
          bg-white border border-gray-300 rounded-lg shadow-lg
          z-50 max-h-60 overflow-y-auto
        "
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className="
                w-full flex items-center justify-between gap-2
                px-3 py-2 text-left text-sm
                hover:bg-gray-50 transition-colors duration-200
                first:rounded-t-lg last:rounded-b-lg
              "
            >
              <span className="truncate">{option}</span>
              {value === option && (
                <Check size={16} className="text-blue-500 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
