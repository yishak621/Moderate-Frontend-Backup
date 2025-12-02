"use client";

import { AIAnalysisResult } from "@/types/aiAnalysis.type";
import { X } from "lucide-react";

interface AIGraderResultModalProps {
  result: AIAnalysisResult;
  onClose?: () => void;
}

export default function AIGraderResultModal({
  result,
  onClose,
}: AIGraderResultModalProps) {
  // Backend stores the grading payload in result.result for type="grader"
  // Handle both direct result.result and nested result.result.rawResult
  const grading: any = result.result?.rawResult || result.result || {};

  const criteria: any[] = grading.criteriaScores || grading.criteria || [];
  const strengths: string[] = grading.strengths || [];
  const weaknesses: string[] = grading.weaknesses || [];
  const recommendations: string[] = grading.recommendations || [];

  return (
    <div className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] max-h-screen overflow-y-scroll scrollbar-hide p-6 sm:p-10 rounded-[27px] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-start gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-xl text-[#0c0c0c] font-medium">AI Grader Result</p>
          <p className="text-sm text-[#717171]">
            Detailed rubric-based evaluation for{" "}
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

      {/* Overall summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        {grading.overallScore != null && grading.maxScore != null && (
          <div className="bg-blue-50 rounded-lg px-3 py-2">
            <p className="text-xs text-blue-700 font-medium">Score</p>
            <p className="text-base font-semibold text-blue-900">
              {grading.overallScore} / {grading.maxScore}
            </p>
          </div>
        )}
        {grading.overallPercentage != null && (
          <div className="bg-emerald-50 rounded-lg px-3 py-2">
            <p className="text-xs text-emerald-700 font-medium">Percentage</p>
            <p className="text-base font-semibold text-emerald-900">
              {grading.overallPercentage}%
            </p>
          </div>
        )}
        {grading.grade && (
          <div className="bg-indigo-50 rounded-lg px-3 py-2">
            <p className="text-xs text-indigo-700 font-medium">Grade</p>
            <p className="text-base font-semibold text-indigo-900">
              {grading.grade}
            </p>
          </div>
        )}
      </div>

      {/* Overall feedback */}
      {grading.feedback && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-800">Overall Feedback</p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
            {grading.feedback}
          </p>
        </div>
      )}

      {/* Criteria scores */}
      {criteria.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-800">Criteria Scores</p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {criteria.map((c, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm space-y-1"
              >
                <div className="flex justify-between items-center gap-2">
                  <p className="font-semibold text-gray-900">
                    {c.criterion || c.name || `Criterion ${idx + 1}`}
                  </p>
                  {c.score != null && c.maxScore != null && (
                    <p className="text-xs text-gray-700 font-medium">
                      {c.score} / {c.maxScore}
                    </p>
                  )}
                </div>
                {c.feedback && (
                  <p className="text-xs text-gray-600">{c.feedback}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths / Weaknesses */}
      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {strengths.length > 0 && (
            <div>
              <p className="font-medium text-emerald-800 mb-1">Strengths</p>
              <ul className="list-disc list-inside space-y-1 text-emerald-900 bg-emerald-50 rounded-lg p-3">
                {strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {weaknesses.length > 0 && (
            <div>
              <p className="font-medium text-rose-800 mb-1">Weaknesses</p>
              <ul className="list-disc list-inside space-y-1 text-rose-900 bg-rose-50 rounded-lg p-3">
                {weaknesses.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-1 text-sm">
          <p className="font-medium text-gray-800">Recommendations</p>
          <ul className="list-disc list-inside space-y-1 text-gray-800 bg-yellow-50 rounded-lg p-3">
            {recommendations.map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
