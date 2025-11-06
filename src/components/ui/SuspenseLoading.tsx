"use client";

import React from "react";

type SuspenseLoadingProps = {
  message?: string;
  fullscreen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: {
    spinner: "w-6 h-6 border-2",
    gap: "gap-2",
    dot: "w-1.5 h-1.5",
    text: "text-xs",
  },
  md: {
    spinner: "w-9 h-9 border-3",
    gap: "gap-3",
    dot: "w-2 h-2",
    text: "text-sm",
  },
  lg: {
    spinner: "w-12 h-12 border-4",
    gap: "gap-4",
    dot: "w-2.5 h-2.5",
    text: "text-base",
  },
};

export default function SuspenseLoading({
  message = "Loading...",
  fullscreen = false,
  size = "md",
  className = "",
}: SuspenseLoadingProps) {
  const cfg = sizeMap[size];

  return (
    <div
      className={`${
        fullscreen ? "fixed inset-0" : "w-full h-full"
      } flex items-center justify-center bg-white/80 backdrop-blur-[1px] ${className}`}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div className={`flex flex-col items-center ${cfg.gap}`}>
        {/* Spinner (brand blue ring) */}
        <div className="relative">
          <div
            className={`${cfg.spinner} rounded-full border-[#368FFF] border-t-transparent animate-spin`}
          />
          {/* Inner white disc for contrast */}
          <div className="absolute inset-1 rounded-full bg-white/80" />
        </div>

        {/* Three bouncing dots (brand blue) */}
        <div className="flex items-center justify-center gap-1.5 mt-1">
          {[0, 1, 2].map((i) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={`${cfg.dot} rounded-full bg-[#368FFF] animate-bounce`}
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>

        {/* Label */}
        {message && (
          <p className={`text-[#0C0C0C] ${cfg.text} mt-1.5 select-none`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
