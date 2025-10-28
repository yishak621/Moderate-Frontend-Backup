import { ReactNode, ButtonHTMLAttributes } from "react";

interface MobileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "red" | "green" | "outline";
  className?: string;
}

const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  icon,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex justify-center items-center gap-2.5 rounded-[87px] font-normal text-[13px] transition-colors duration-200 cursor-pointer";

  const variantStyles = {
    primary: "bg-[#368FFF] text-[#FDFDFD] hover:bg-[#2574db]",
    red: "bg-[#F25555] text-[#FDFDFD] hover:bg-[#D94444]",
    secondary:
      "bg-[#FDFDFD] text-gray-800 hover:bg-[#e5e5e5] border border-[#DBDBDB] text-[#0C0C0C]",
    green: "bg-[#4CAF50] text-white hover:bg-[#3e9e43]",
    outline:
      "border border-[#368FFF] text-[#368FFF] bg-transparent hover:bg-[#e8f1ff]",
  };

  return (
    <button
      className={`${baseStyles} 
        h-[45px] px-[20px] py-4
        ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

export default MobileButton;
