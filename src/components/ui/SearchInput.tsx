"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import clsx from "clsx";

interface SearchInputProps {
  label?: string;
  placeholder?: string;
  onSearch: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
  error?: string;
  value?: string;
}

export default function SearchInput({
  label,
  placeholder = "Search...",
  value, // ✅ now defined
  onSearch,
  onChange,
  className,
  error,
}: SearchInputProps) {
  const handleSearch = () => {
    onSearch(value || ""); // or just onSearch(value) since value is always string now
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-[#0c0c0c] text-sm font-normal sm:text-base mb-1 block">
          {label}
        </label>
      )}

      <div
        className={clsx(
          "flex items-center w-full rounded-[62px] border h-[45px]",
          "sm:h-12 lg:h-14",
          "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={clsx(
            "w-full px-6 py-[15px] text-sm font-normal",
            "placeholder:text-sm placeholder:font-normal",
            "sm:px-6 sm:py-4 sm:text-base sm:placeholder:text-base",
            "lg:px-8 lg:py-5 lg:text-lg lg:placeholder:text-lg",
            "rounded-l-[62px] outline-0 bg-white text-gray-900"
          )}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 pr-6 text-[#717171] cursor-pointer rounded-r-[62px] flex items-center justify-center"
        >
          <Search size={20} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
