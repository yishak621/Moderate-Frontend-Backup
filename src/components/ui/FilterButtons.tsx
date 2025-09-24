"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

type FilterOption = string;

interface FilterButtonsProps {
  filters: FilterOption[];
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  filters,
  activeFilter,
  onFilterChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    if (!containerRef.current) return;

    // select all buttons only, skip the indicator span
    const buttons = containerRef.current.querySelectorAll("button");
    const activeIndex = filters.indexOf(activeFilter);
    const activeBtn = buttons[activeIndex] as HTMLElement;

    if (activeBtn) {
      setIndicatorStyle({
        width: `${activeBtn.offsetWidth}px`,
        transform: `translateX(${activeBtn.offsetLeft}px)`,
      });
    }
  }, [activeFilter, filters]);

  return (
    <div
      ref={containerRef}
      className="relative flex gap-2 bg-[#fdfdfd] border border-[#DBDBDB] rounded-full p-1"
    >
      {/* Sliding background indicator */}
      <span
        className="absolute top-1 bottom-1 bg-[#368FFF] rounded-full transition-all duration-300 ease-in-out"
        style={indicatorStyle}
      />

      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={clsx(
            "relative flex flex-row items-center justify-center z-10 px-4 py-1 rounded-full text-sm font-medium transition-colors duration-300",
            activeFilter === filter ? "text-white" : "text-[#717171]"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};
