"use client";

interface ToggleSettingProps {
  title: string;
  description: string;
  field?: string;
  value?: boolean; // ✅ renamed from defaultValue for clarity
  onChange: (value: boolean, field?: string) => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  title,
  description,
  field,
  value = false,
  onChange,
}) => {
  const handleToggle = () => {
    onChange(!value, field);
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
        type="button"
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
            value ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSetting;
