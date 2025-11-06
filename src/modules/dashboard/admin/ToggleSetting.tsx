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
    <div className="flex flex-row justify-between items-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-b border-gray-200 hover:shadow-sm transition">
      {/* Left side */}
      <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0 pr-2">
        <p className="text-[#0C0C0C] text-[14px] font-medium leading-tight">
          {title}
        </p>
        <p className="text-[#717171] text-[13px] font-normal leading-relaxed">
          {description}
        </p>
      </div>

      {/* Toggle */}
      <button
        type="button"
        onClick={handleToggle}
        className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
          value ? "bg-[#368FFF]" : "bg-gray-300"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow-md transition-transform ${
            value
              ? "translate-x-4 sm:translate-x-5"
              : "translate-x-0.5 sm:translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSetting;
