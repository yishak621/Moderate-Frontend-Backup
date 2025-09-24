// components/ui/DatePickerInput.tsx
"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css"; // 👈 custom styles
import { Calendar } from "lucide-react";
import clsx from "clsx";

interface DatePickerInputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  onChange?: (date: Date | null) => void;
}

export default function DatePickerInput({
  label,
  error,
  placeholder = "Select date",
  onChange,
}: DatePickerInputProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    onChange?.(date);
  };

  if (!mounted) return null;

  return (
    <div className="w-full">
      {label && (
        <label className="text-[#0c0c0c] text-base font-normal">{label}</label>
      )}
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          placeholderText={placeholder}
          dateFormat="yyyy-MM-dd"
          //   className={clsx(
          //     "w-full rounded-lg border",
          //     "px-3 py-2 text-sm",
          //     "sm:px-4 sm:py-2.5 sm:text-base",
          //     "md:px-5 md:py-3 md:text-base",
          //     "lg:px-6 lg:py-3.5 lg:text-lg",
          //     "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-0",
          //     "bg-white text-gray-900",
          //     error ? "border-red-500" : "border-gray-300"
          //   )}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-0"
        />
        <Calendar
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          size={20}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <style jsx global>{`
        .react-datepicker {
          border-radius: 0.75rem;
          border: 1px solid #d1d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .react-datepicker__header {
          background-color: #368fff;
          color: white;
          border-bottom: none;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #368fff !important;
          color: white !important;
        }
        .react-datepicker__day:hover {
          background-color: #2563eb !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
}
