// components/ui/Textarea.tsx
"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-[#0c0c0c] text-base font-normal">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            "w-full rounded-lg border min-h-[118px]",
            "px-3 py-2 text-sm", // base
            "sm:px-4 sm:py-2.5 sm:text-base", // small screens
            "md:px-5 md:py-3 md:text-base", // tablets
            "lg:px-6 lg:py-3.5 lg:text-lg", // large screens
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-0",
            "bg-white text-gray-900 resize-none",
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

Textarea.displayName = "Textarea";

export default Textarea;
