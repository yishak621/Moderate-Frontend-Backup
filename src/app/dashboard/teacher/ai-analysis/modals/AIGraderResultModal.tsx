"use client";

import { AIAnalysisResult } from "@/types/aiAnalysis.type";
import { X, CheckCircle2, XCircle, Award, AlertCircle } from "lucide-react";

interface AIGraderResultModalProps {
  result: AIAnalysisResult;
  onClose?: () => void;
}

export default function AIGraderResultModal({
  result,
  onClose,
}: AIGraderResultModalProps) {
  // Backend stores the grading payload in result.result for type="grader"
  // Structure: { rawResult: {...}, metadata: { gradingType: "...", ... } }
  // Handle both direct result.result and nested result.result.rawResult
  const grading: any = result.result?.rawResult || result.result || {};
  // Metadata is at the same level as rawResult, not inside it
  const metadata = result.result?.metadata || grading.metadata || {};
  const gradingType = metadata.gradingType || grading.gradingType || "numeric";

  const criteria: any[] = grading.criteriaScores || grading.criteria || [];
  const strengths: string[] = grading.strengths || [];
  const weaknesses: string[] = grading.weaknesses || [];
  const recommendations: string[] = grading.recommendations || [];
  const checklistItems: any[] = grading.checklistItems || [];
  const overallFeedback = grading.overallFeedback || grading.feedback;

  // Calculate checklist stats
  const checklistStats =
    checklistItems.length > 0
      ? {
          total: checklistItems.length,
          checked: checklistItems.filter((item: any) => item.checked).length,
          unchecked: checklistItems.filter((item: any) => !item.checked).length,
          percentage: Math.round(
            (checklistItems.filter((item: any) => item.checked).length /
              checklistItems.length) *
              100
          ),
        }
      : null;

  return (
    <div className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] max-h-screen overflow-y-scroll scrollbar-hide p-6 sm:p-10 rounded-[27px] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-start gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-xl text-[#0c0c0c] font-medium">
            AI Grading Result
          </p>
          <p className="text-sm text-[#717171]">
            {gradingType === "checklist" && "Checklist-based evaluation for "}
            {gradingType === "numeric" && "Numeric scoring evaluation for "}
            {gradingType === "letter" && "Letter grade evaluation for "}
            {gradingType === "rubric" && "Rubric-based evaluation for "}
            {gradingType === "weightedRubric" &&
              "Weighted rubric evaluation for "}
            {gradingType === "passFail" && "Pass/Fail evaluation for "}
            {!gradingType && "Detailed evaluation for "}
            <span className="font-semibold text-[#0c0c0c]">
              {result.fileName}
            </span>
            {gradingType && (
              <span className="text-[#717171]">
                {" "}
                (Grading Type:{" "}
                <span className="font-medium text-[#0c0c0c] capitalize">
                  {gradingType === "weightedRubric"
                    ? "Weighted Rubric"
                    : gradingType === "passFail"
                    ? "Pass/Fail"
                    : gradingType}
                </span>
                )
              </span>
            )}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X width={22} height={22} />
          </button>
        )}
      </div>

      {/* Overall Summary Cards - Different layouts based on grading type */}
      {gradingType === "checklist" && checklistStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl px-4 py-3 border border-blue-200">
            <p className="text-xs text-blue-700 font-medium mb-1">Completion</p>
            <p className="text-2xl font-bold text-blue-900">
              {checklistStats.checked} / {checklistStats.total}
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl px-4 py-3 border border-emerald-200">
            <p className="text-xs text-emerald-700 font-medium mb-1">
              Percentage
            </p>
            <p className="text-2xl font-bold text-emerald-900">
              {checklistStats.percentage}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl px-4 py-3 border border-indigo-200">
            <p className="text-xs text-indigo-700 font-medium mb-1">Status</p>
            <p className="text-lg font-bold text-indigo-900">
              {checklistStats.percentage >= 70 ? "Pass" : "Needs Work"}
            </p>
          </div>
        </div>
      ) : gradingType === "passFail" ? (
        <div className="grid grid-cols-1 gap-3">
          <div
            className={`rounded-xl px-4 py-4 border-2 ${
              grading.passed || grading.status === "pass"
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300"
                : "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-300"
            }`}
          >
            <div className="flex items-center gap-3">
              {grading.passed || grading.status === "pass" ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600" />
              )}
              <div>
                <p className="text-xs font-medium mb-1">
                  {grading.passed || grading.status === "pass"
                    ? "PASS"
                    : "FAIL"}
                </p>
                <p className="text-lg font-bold">
                  {grading.passed || grading.status === "pass"
                    ? "Assignment Passed"
                    : "Assignment Failed"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {grading.overallScore != null && grading.maxScore != null && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl px-4 py-3 border border-blue-200">
              <p className="text-xs text-blue-700 font-medium mb-1">Score</p>
              <p className="text-2xl font-bold text-blue-900">
                {grading.overallScore} / {grading.maxScore}
              </p>
            </div>
          )}
          {grading.overallPercentage != null && (
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl px-4 py-3 border border-emerald-200">
              <p className="text-xs text-emerald-700 font-medium mb-1">
                Percentage
              </p>
              <p className="text-2xl font-bold text-emerald-900">
                {grading.overallPercentage}%
              </p>
            </div>
          )}
          {grading.grade && (
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl px-4 py-3 border border-indigo-200">
              <p className="text-xs text-indigo-700 font-medium mb-1">Grade</p>
              <p className="text-2xl font-bold text-indigo-900">
                {grading.grade}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Overall Feedback */}
      {overallFeedback && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-semibold text-gray-800">
              Overall Feedback
            </p>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-gray-800 leading-relaxed">
              {overallFeedback}
            </p>
          </div>
        </div>
      )}

      {/* Checklist Items - Specific UI for checklist type */}
      {gradingType === "checklist" && checklistItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-semibold text-gray-800">
              Checklist Criteria Evaluation
            </p>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {checklistItems.map((item: any, idx: number) => (
              <div
                key={idx}
                className={`border-2 rounded-xl p-4 transition-all ${
                  item.checked
                    ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300"
                    : "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.checked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Criteria Name */}
                    <div className="flex items-center gap-2 mb-2">
                      <p
                        className={`font-semibold text-base ${
                          item.checked ? "text-emerald-900" : "text-rose-900"
                        }`}
                      >
                        {item.item}
                      </p>
                      {item.checked && (
                        <span className="px-2.5 py-1 bg-emerald-200 text-emerald-800 text-xs font-semibold rounded-full">
                          ✓ Met
                        </span>
                      )}
                      {!item.checked && (
                        <span className="px-2.5 py-1 bg-rose-200 text-rose-800 text-xs font-semibold rounded-full">
                          ✗ Not Met
                        </span>
                      )}
                    </div>
                    {/* Result Status */}
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-600">
                        Result:{" "}
                        <span
                          className={`font-semibold ${
                            item.checked ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {item.checked ? "PASSED" : "NOT MET"}
                        </span>
                      </p>
                    </div>
                    {/* Comment/Feedback */}
                    {item.feedback && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          Comment:
                        </p>
                        <p
                          className={`text-sm leading-relaxed ${
                            item.checked ? "text-emerald-800" : "text-rose-800"
                          }`}
                        >
                          {item.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Criteria Scores - For rubric, weightedRubric, numeric, letter */}
      {criteria.length > 0 && gradingType !== "checklist" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <p className="text-sm font-semibold text-gray-800">
              {gradingType === "rubric" || gradingType === "weightedRubric"
                ? "Rubric Criteria"
                : "Criteria Evaluation"}
            </p>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {criteria.map((c: any, idx: number) => {
              const scorePercentage =
                c.maxScore > 0 ? Math.round((c.score / c.maxScore) * 100) : 0;
              const isGood = scorePercentage >= 70;
              const isExcellent = scorePercentage >= 90;

              return (
                <div
                  key={idx}
                  className={`border-2 rounded-xl p-4 ${
                    isExcellent
                      ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300"
                      : isGood
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300"
                      : "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <p className="font-semibold text-sm text-gray-900 flex-1">
                      {c.criterion || c.name || `Criterion ${idx + 1}`}
                    </p>
                    {c.score != null && c.maxScore != null && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {c.score} / {c.maxScore}
                        </span>
                        {gradingType === "weightedRubric" &&
                          c.weight != null && (
                            <span className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full">
                              {c.weight}% weight
                            </span>
                          )}
                      </div>
                    )}
                  </div>
                  {c.score != null && c.maxScore != null && (
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isExcellent
                              ? "bg-gradient-to-r from-emerald-500 to-green-500"
                              : isGood
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                              : "bg-gradient-to-r from-amber-500 to-yellow-500"
                          }`}
                          style={{ width: `${scorePercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {scorePercentage}% achieved
                      </p>
                    </div>
                  )}
                  {c.feedback && (
                    <p className="text-sm text-gray-700 leading-relaxed mt-2">
                      {c.feedback}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strengths / Weaknesses */}
      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-800">
                  Strengths
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-4">
                <ul className="space-y-2">
                  {strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-emerald-900 leading-relaxed">
                        {s}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {weaknesses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <p className="text-sm font-semibold text-rose-800">
                  Weaknesses
                </p>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-xl p-4">
                <ul className="space-y-2">
                  {weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-rose-900 leading-relaxed">
                        {w}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-semibold text-gray-800">
              Recommendations
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4">
            <ul className="space-y-2">
              {recommendations.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span className="text-sm text-gray-800 leading-relaxed flex-1">
                    {r}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
