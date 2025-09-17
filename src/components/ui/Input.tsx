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
            "w-full rounded-lg border px-6 py-4.5 text-sm outline-none",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
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
