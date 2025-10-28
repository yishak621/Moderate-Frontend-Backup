"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface MobileTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const MobileTextarea = forwardRef<HTMLTextAreaElement, MobileTextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-[#0c0c0c] text-sm font-normal mb-1 block">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            "w-full rounded-[62px] border min-h-[120px]",
            "px-6 py-[15px] text-sm font-normal",
            "placeholder:text-sm placeholder:font-normal",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-0",
            "bg-white text-gray-900 resize-none",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

MobileTextarea.displayName = "MobileTextarea";

export default MobileTextarea;
