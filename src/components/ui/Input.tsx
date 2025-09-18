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
          <label className="text-[#0c0c0c] text-base font-normal">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            "w-full rounded-lg border",
            "px-3 py-2 text-sm", // base
            "sm:px-4 sm:py-2.5 sm:text-base", // small screens
            "md:px-5 md:py-3 md:text-base", // tablets
            "lg:px-6 lg:py-3.5 lg:text-lg", // large screens
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-0",
            "bg-white  text-gray-900 ",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
