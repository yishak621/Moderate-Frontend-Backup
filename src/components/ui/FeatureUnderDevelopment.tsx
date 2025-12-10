"use client";

import { Wrench } from "lucide-react";
import { ReactNode } from "react";

interface FeatureUnderDevelopmentProps {
  featureName: string;
  icon?: ReactNode;
  description?: string;
}

export default function FeatureUnderDevelopment({
  featureName,
  icon,
  description,
}: FeatureUnderDevelopmentProps) {
  const defaultIcon = <Wrench className="w-16 h-16 text-gray-400" />;

  return (
    <div className="w-full mx-auto p-4 sm:p-6">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-white rounded-xl border border-gray-200 p-12 max-w-2xl w-full">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {icon || defaultIcon}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {featureName} - Under Development
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-base sm:text-lg mb-6">
            {description ||
              "This feature is currently under development and will be available soon."}
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This feature is being actively developed
              and will be released in a future update. Thank you for your
              patience!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

