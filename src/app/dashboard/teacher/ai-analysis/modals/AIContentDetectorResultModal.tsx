"use client";

import { AIAnalysisResult } from "@/types/aiAnalysis.type";
import { X } from "lucide-react";

interface AIContentDetectorResultModalProps {
  result: AIAnalysisResult;
  onClose?: () => void;
}

export default function AIContentDetectorResultModal({
  result,
  onClose,
}: AIContentDetectorResultModalProps) {
  // Backend stores detector payload in result.result for type="content_detector"
  const detection: any = result.result || {};
  const sections: string[] = detection.aiContentSections || [];

  return (
    <div className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] max-h-screen overflow-y-scroll scrollbar-hide p-6 sm:p-10 rounded-[27px] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-start gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-xl text-[#0c0c0c] font-medium">AI Content Detector Result</p>
          <p className="text-sm text-[#717171]">
            Detect AI-generated content in{" "}
            <span className="font-semibold text-[#0c0c0c]">
              {result.fileName}
            </span>
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-700"
            aria-label="Close"
          >
            <X width={22} height={22} />
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {detection.aiPercentage != null && (
          <div className="bg-purple-50 rounded-lg px-3 py-2">
            <p className="text-xs text-purple-700 font-medium">
              AI Content Probability
            </p>
            <p className="text-base font-semibold text-purple-900">
              {detection.aiPercentage}%
            </p>
          </div>
        )}
        {detection.confidence != null && (
          <div className="bg-indigo-50 rounded-lg px-3 py-2">
            <p className="text-xs text-indigo-700 font-medium">Confidence</p>
            <p className="text-base font-semibold text-indigo-900">
              {detection.confidence}%
            </p>
          </div>
        )}
      </div>

      {/* Flagged sections */}
      {sections.length > 0 && (
        <div className="space-y-2 text-sm">
          <p className="font-medium text-gray-800">
            Flagged AI-like Sections
          </p>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {sections.map((text, idx) => (
              <li
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3"
              >
                <p className="text-xs text-gray-500 mb-1">Section {idx + 1}</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Raw concatenated AI content if present */}
      {detection.rawAiContent && (
        <div className="space-y-1 text-sm">
          <p className="font-medium text-gray-800">Raw AI Content Summary</p>
          <p className="text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
            {detection.rawAiContent}
          </p>
        </div>
      )}
    </div>
  );
}

