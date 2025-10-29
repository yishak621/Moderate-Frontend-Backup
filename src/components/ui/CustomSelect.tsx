"use client";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useEffect, useState } from "react";

const animatedComponents = makeAnimated();

type Option = { value: string | boolean; label: string };

interface CustomSelectProps {
  options: Option[];
  defaultValue?: Option;
  onChange?: (selected: Option | null) => void;
  placeholder?: string;
  isClearable?: boolean;
}

export default function CustomSelect({
  options,
  defaultValue,
  onChange,
  placeholder,
  isClearable,
}: CustomSelectProps) {
  const [selected, setSelected] = useState<Option | null>(defaultValue || null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleChange = (newValue: Option | null) => {
    setSelected(newValue || null);
    onChange?.(newValue || null);
  };

  if (!mounted) return null;

  return (
    <Select
      options={options}
      isMulti={false} // single select only
      closeMenuOnSelect={true}
      components={animatedComponents}
      defaultValue={defaultValue}
      value={selected}
      onChange={handleChange}
      placeholder={placeholder}
      isClearable={isClearable}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: "45px",
          borderRadius: "0.5rem",
          borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
          boxShadow: state.isFocused
            ? "0 0 0 2px rgba(59, 130, 246, 0.2)"
            : "none",
          paddingLeft: "12px",
          paddingRight: "12px",
          fontSize: "14px",
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
