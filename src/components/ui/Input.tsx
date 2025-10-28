// components/ui/Input.tsx
"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type = "text", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-[#0c0c0c] text-sm font-normal text-left block mb-1 sm:text-base">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            "w-full",
            // Mobile specifications
            "h-[45px] rounded-[62px] border border-gray-300",
            "px-6 py-[15px] text-sm font-normal",
            "placeholder:text-sm placeholder:font-normal",
            // Tablet and up
            "sm:h-12 sm:px-6 sm:py-3 sm:text-base",
            "sm:placeholder:text-base",
            // Desktop
            "lg:h-14 lg:px-8 lg:py-4 lg:text-lg",
            "lg:placeholder:text-lg",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-0",
            "bg-white text-gray-900",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs sm:mt-1.5 sm:text-sm text-red-500 text-left">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
