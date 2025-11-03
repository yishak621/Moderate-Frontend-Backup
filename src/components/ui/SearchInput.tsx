"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import clsx from "clsx";

interface SearchInputProps {
  label?: string;
  placeholder?: string;
  onSearch: (value: string) => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
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
  onClear,
  className,
  error,
}: SearchInputProps) {
  const handleSearch = () => {
    onSearch(value || ""); // or just onSearch(value) since value is always string now
  };

  const handleClear = () => {
    onChange?.("");
    onClear?.();
    onSearch("");
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
            "rounded-l-[62px] outline-0  text-gray-900"
          )}
        />
        <div className="flex items-center gap-1 pr-2">
          {value && value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 hover:bg-gray-200 bg-gray-100 rounded-full transition-colors flex items-center justify-center"
              aria-label="Clear search"
            >
              <X size={16} className="text-gray-600" />
            </button>
          )}
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 text-[#717171] cursor-pointer rounded-r-[62px] flex items-center justify-center"
          >
            <Search size={20} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
