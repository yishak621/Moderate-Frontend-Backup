"use client";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useEffect, useState } from "react";

const animatedComponents = makeAnimated();

type Option = { value: string; label: string };

interface MobileCustomMultiSelectProps {
  options: Option[];
  defaultValue?: Option[];
  onChange?: (selected: Option[]) => void;
  placeholder?: string;
  isSearchable?: boolean;
}

export function MobileCustomMultiSelect({
  options,
  defaultValue,
  onChange,
  placeholder,
  isSearchable,
}: MobileCustomMultiSelectProps) {
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
          minHeight: "38px",
          borderRadius: "24.5px",
          borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
          borderWidth: "1px",
          boxShadow: state.isFocused
            ? "0 0 0 2px rgba(59, 130, 246, 0.2)"
            : "none",
          paddingLeft: "14px",
          paddingRight: "14px",
          fontSize: "13px",
          fontWeight: "400",
        }),
        valueContainer: (base) => ({
          ...base,
          padding: "0px",
        }),
        input: (base) => ({
          ...base,
          margin: "0px",
          padding: "0px",
          fontSize: "13px",
          fontWeight: "400",
        }),
        placeholder: (base) => ({
          ...base,
          fontSize: "13px",
          fontWeight: "400",
        }),
        multiValue: (base) => ({
          ...base,
          borderRadius: "12px",
          backgroundColor: "#eff6ff",
          fontSize: "13px",
        }),
        multiValueLabel: (base) => ({
          ...base,
          fontSize: "13px",
          fontWeight: "400",
          color: "#1f2937",
        }),
        indicatorsContainer: (base) => ({
          ...base,
          paddingRight: "4px",
        }),
        menu: (base) => ({
          ...base,
          borderRadius: "12px",
          fontSize: "13px",
        }),
        option: (base, state) => ({
          ...base,
          fontSize: "13px",
          fontWeight: "400",
          padding: "8px 14px",
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
