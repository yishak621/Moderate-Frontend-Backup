// components/Button.tsx
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "red" | "green" | "outline";

  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex justify-center items-center gap-2.5 rounded-[87px] font-normal text-[13px] transition-colors duration-200 cursor-pointer";

  const variantStyles = {
    primary: "bg-[#368FFF] text-[#FDFDFD] hover:bg-[#2574db]  ", // deeper blue
    red: "bg-[#F25555] text-[#FDFDFD] hover:bg-[#D94444]  ",
    secondary:
      "bg-[#FDFDFD] text-gray-800 hover:bg-[#e5e5e5]  border border-[#DBDBDB]  text-[#0C0C0C]", // soft gray
    green: "bg-[#4CAF50] text-white hover:bg-[#3e9e43]",
    outline:
      "border border-[#368FFF] text-[#368FFF] bg-transparent hover:bg-[#e8f1ff]",
  };

  return (
    <button
      className={`${baseStyles} 
        h-[45px] px-[20px] py-4
        sm:h-12 sm:px-8 sm:py-4 sm:text-sm
        lg:h-14 lg:px-12 lg:text-base
        ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
