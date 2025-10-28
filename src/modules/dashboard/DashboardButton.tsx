// DashboardButton.tsx
import React from "react";

interface DashboardButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  bgColor?: string; // Tailwind bg class
  textColor?: string; // Tailwind text class
  hoverBgColor?: string; // Tailwind hover bg class
  hoverTextColor?: string; // Tailwind hover text class
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
  icon,
  label,
  onClick,
  bgColor = "bg-white",
  textColor = "text-[#0C0C0C]",
  hoverBgColor = "hover:bg-[#368FFF]",
  hoverTextColor = "hover:text-white",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
       w-full flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2 
       py-3 px-2 sm:py-4 sm:px-10
        rounded-[10px] border border-[#DBDBDB]
        transition-all duration-300 ease-in-out
        ${bgColor} ${textColor} ${hoverBgColor} ${hoverTextColor}
        transform hover:scale-105
        cursor-pointer outline-none
        text-xs sm:text-sm
      `}
    >
      {icon}
      <span className="text-center">{label}</span>
    </button>
  );
};

export default DashboardButton;
