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
          <label className="text-[#0c0c0c] text-sm font-normal sm:text-base mb-1 block">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            "w-full rounded-[62px] border min-h-[120px]",
            "px-6 py-[15px] text-sm font-normal",
            "placeholder:text-sm placeholder:font-normal",
            "sm:min-h-[130px] sm:px-6 sm:py-4 sm:text-base",
            "lg:min-h-[150px] lg:px-8 lg:py-5 lg:text-lg",
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
