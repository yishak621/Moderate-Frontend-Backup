"use client";

import { useState } from "react";

interface ToggleSettingProps {
  title: string;
  description: string;
  field: string; // e.g. "registration"
  defaultValue?: boolean;
  onChange: (value: Record<string, boolean>) => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  title,
  description,
  field,
  defaultValue = false,
  onChange,
}) => {
  const [enabled, setEnabled] = useState(defaultValue);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    onChange({ [field]: newValue });
  };

  return (
    <div className="flex flex-row justify-between items-center py-3 px-4 rounded-lg border-b border-gray-200 hover:shadow-sm transition">
      {/* Left side */}
      <div className="flex flex-col gap-1">
        <p className="text-[#0C0C0C] text-base font-medium">{title}</p>
        <p className="text-[#717171] text-[15px] font-normal">{description}</p>
      </div>

      {/* Toggle */}
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSetting;
