"use client";

import { Search } from "lucide-react";
import React from "react";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
}

const SearchInputTeacher: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
}) => {
  return (
    <div className="flex items-center w-[414px] h-[50px] px-[18px] rounded-[37px] bg-[#FDFDFD] shadow-sm border border-gray-200">
      {/* Icon */}
      <Search
        size={20}
        className="text-gray-500 mr-2 cursor-pointer"
        onClick={onSearch}
      />

      {/* Input */}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 outline-none bg-transparent text-gray-800 text-sm placeholder:text-gray-400"
      />
    </div>
  );
};

export default SearchInputTeacher;
