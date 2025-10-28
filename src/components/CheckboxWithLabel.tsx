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
    <label className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none text-[#3F4236]">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="h-4 w-4 sm:h-5 sm:w-5 accent-blue-600 rounded border-gray-300"
      />
      <span className="text-sm text-[#3F4236] font-semibold sm:text-base sm:font-semibold">
        {label}
      </span>
    </label>
  );
}
