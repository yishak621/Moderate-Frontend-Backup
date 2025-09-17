"use client";

import { useState } from "react";

type CheckboxWithLabelProps = {
  label: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function CheckboxWithLabel({
  label,
  defaultChecked = false,
  onChange,
}: CheckboxWithLabelProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue); // return the value to parent
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="h-4 w-4 accent-blue-600"
      />
      <span>{label}</span>
    </label>
  );
}
