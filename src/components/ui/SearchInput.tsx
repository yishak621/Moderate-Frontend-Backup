"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import clsx from "clsx";

interface SearchInputProps {
  label?: string;
  placeholder?: string;
  onSearch: (value: string) => void;
  className?: string;
  error?: string;
}

export default function SearchInput({
  label,
  placeholder = "Search...",
  onSearch,
  className,
  error,
}: SearchInputProps) {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-[#0c0c0c] text-base font-normal">{label}</label>
      )}

      <div
        className={clsx(
          "flex items-center w-full rounded-lg border",
          "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
      >
        {" "}
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 pr-0 py-2 text-[#717171] cursor-pointer rounded-r-lg flex items-center justify-center"
        >
          <Search size={22} />
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={clsx(
            "w-full px-3 py-2 text-sm",
            "sm:px-4 sm:py-2.5 sm:text-base",
            "md:px-5 md:py-3 md:text-base",
            "lg:px-6 lg:py-3.5 lg:text-lg",
            "rounded-l-lg outline-0 bg-white text-gray-900"
          )}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
