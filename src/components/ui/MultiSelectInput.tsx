// components/CustomMultiSelect.tsx
"use client";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useEffect, useState } from "react";

const animatedComponents = makeAnimated();

type Option = { value: string; label: string };

interface CustomMultiSelectProps {
  options: Option[];
  defaultValue?: Option[];
  onChange?: (selected: Option[]) => void;
  placeholder?: string;
  isSearchable?: boolean;
}

export function CustomMultiSelect({
  options,
  defaultValue,
  onChange,
  placeholder,
  isSearchable,
}: CustomMultiSelectProps) {
  const [selected, setSelected] = useState<Option[]>(defaultValue || []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleChange = (newValue: any) => {
    setSelected(newValue || []);
    onChange?.(newValue || []);
  };

  if (!mounted) return null;

  return (
    <Select
      options={options}
      isMulti
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={defaultValue}
      value={selected}
      onChange={handleChange}
      placeholder={placeholder}
      isSearchable={isSearchable}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: "40px", // Mobile: matches Input h-10
          borderRadius: "0.5rem", // matches Input rounded-lg (8px)
          borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
          borderWidth: "1px",
          boxShadow: state.isFocused
            ? "0 0 0 2px rgba(59, 130, 246, 0.2)"
            : "none",
          paddingLeft: "12px", // Mobile: matches Input px-3 (12px)
          paddingRight: "12px",
          fontSize: "14px", // Mobile: matches Input text-sm
          fontWeight: "400",
          "@media (min-width: 640px)": {
            minHeight: "48px", // matches Input sm:h-12
            paddingLeft: "16px", // matches Input sm:px-4 (16px)
            paddingRight: "16px",
            fontSize: "16px", // matches Input sm:text-base
          },
        }),
        valueContainer: (base) => ({
          ...base,
          padding: "0px",
        }),
        input: (base) => ({
          ...base,
          margin: "0px",
          padding: "0px",
        }),
        indicatorsContainer: (base) => ({
          ...base,
          paddingRight: "8px",
        }),
        menu: (base) => ({
          ...base,
          fontSize: "14px",
          "@media (min-width: 640px)": {
            fontSize: "14px",
          },
        }),
        option: (base, state) => ({
          ...base,
          fontSize: "13px",
          padding: "8px 12px",
          "@media (min-width: 640px)": {
            fontSize: "14px",
            padding: "10px 12px",
          },
          backgroundColor: state.isSelected
            ? "#3b82f6"
            : state.isFocused
            ? "#eff6ff"
            : "white",
          color: state.isSelected ? "white" : "#1f2937",
          "&:active": {
            backgroundColor: state.isSelected ? "#3b82f6" : "#dbeafe",
          },
        }),
      }}
    />
  );
}
