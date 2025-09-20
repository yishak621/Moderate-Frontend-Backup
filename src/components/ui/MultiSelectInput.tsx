// components/CustomMultiSelect.tsx
"use client";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useState } from "react";

const animatedComponents = makeAnimated();

type Option = { value: string; label: string };

interface CustomMultiSelectProps {
  options: Option[];
  defaultValue?: Option[];
  onChange?: (selected: Option[]) => void;
  placeholder?: string;
}

export function CustomMultiSelect({
  options,
  defaultValue,
  onChange,
  placeholder,
}: CustomMultiSelectProps) {
  const [selected, setSelected] = useState<Option[]>(defaultValue || []);

  const handleChange = (newValue: any) => {
    setSelected(newValue || []);
    onChange?.(newValue || []);
  };

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
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: "48px", // match your input height
          borderRadius: "0.5rem",
          borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // focus vs normal
          boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
          paddingLeft: "12px", // match input padding
          paddingRight: "12px",
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
