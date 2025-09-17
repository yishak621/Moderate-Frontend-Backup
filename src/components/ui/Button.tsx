// components/Button.tsx
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
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
    "inline-flex  items-center gap-2 px-4 py-4.5 rounded-md font-medium transition-colors duration-200";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
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
