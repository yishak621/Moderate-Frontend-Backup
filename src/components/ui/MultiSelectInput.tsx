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
          minHeight: "45px", // Mobile: 45px
          borderRadius: "62px", // Mobile: 62px pill shape
          borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
          boxShadow: state.isFocused
            ? "0 0 0 2px rgba(59, 130, 246, 0.2)"
            : "none",
          paddingLeft: "24px", // Mobile: 24px
          paddingRight: "24px",
          fontSize: "14px", // Mobile: 14px
          fontWeight: "400",
          "@media (min-width: 640px)": {
            minHeight: "48px",
            fontSize: "15px",
          },
          "@media (min-width: 1024px)": {
            minHeight: "56px",
            fontSize: "16px",
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
      }}
    />
  );
}
