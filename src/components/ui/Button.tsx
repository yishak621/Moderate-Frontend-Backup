// components/Button.tsx
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "red";
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
    "inline-flex justify-center  items-center gap-2 px-4 py-4.5 rounded-md font-medium text-base transition-colors duration-200 cursor-pointer";

  const variantStyles = {
    primary: "bg-[#368FFF] text-[#FDFDFD] hover:bg-[#2574db]  ", // deeper blue
    red: "bg-[#F25555] text-[#FDFDFD] hover:bg-[#D94444]  ",
    secondary:
      "bg-[#FDFDFD] text-gray-800 hover:bg-[#e5e5e5]  border border-[#DBDBDB]  text-[#0C0C0C]", // soft gray
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
