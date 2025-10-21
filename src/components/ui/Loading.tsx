"use client";

import React from "react";

interface LoadingProps {
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ text, className }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 w-full h-full p-4 ${className}`}
    >
      {/* Animated pulsing dots */}
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></span>
        <span className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-200"></span>
        <span className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-400"></span>
      </div>

      {/* Optional text */}
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
};

export default Loading;

// 1. Sidebar loading

// <div className="w-64 h-full">
//   <Loading text="Loading menu items..." />
// </div>


// 2. Empty content space

// <div className="flex-1">
//   <Loading text="No tickets found." />
// </div>


// 3. Full page loader

// <div className="h-screen w-screen">
//   <Loading text="Loading dashboard..." className="h-full" />
// </div>