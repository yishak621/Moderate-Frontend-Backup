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
  placeholder?:string
}

export function CustomMultiSelect({
  options,
  defaultValue,
  onChange,
  placeholder
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
      
    />
  );
}
