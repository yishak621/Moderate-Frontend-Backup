"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface MobileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ label, error, className, type = "text", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-[#0c0c0c] text-sm font-normal text-left block mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            "w-full h-[45px] px-6 py-[15px] text-sm font-normal",
            "border border-gray-300 rounded-[62px]",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-0",
            "bg-white text-gray-900",
            "placeholder:text-sm placeholder:font-normal",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500 text-left">{error}</p>
        )}
      </div>
    );
  }
);

MobileInput.displayName = "MobileInput";

export default MobileInput;
