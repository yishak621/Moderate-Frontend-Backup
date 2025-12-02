"use client";

import { AIAnalysisResult } from "@/types/aiAnalysis.type";
import { X } from "lucide-react";

interface AISimilarityResultModalProps {
  result: AIAnalysisResult;
  onClose?: () => void;
}

export default function AISimilarityResultModal({
  result,
  onClose,
}: AISimilarityResultModalProps) {
  // Backend stores similarity payload in result.result for type="similarity_checker"
  const payload: any = result.result || {};
  const similarities: any[] = payload.similarities || payload.embeddingSimilarities || [];
  const analysis: any = payload.aiAnalysis || {};

  return (
    <div className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] max-h-screen overflow-y-scroll scrollbar-hide p-6 sm:p-10 rounded-[27px] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-start gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-xl text-[#0c0c0c] font-medium">AI Similarity Checker Result</p>
          <p className="text-sm text-[#717171]">
            Compare{" "}
            <span className="font-semibold text-[#0c0c0c]">
              {result.fileName}
            </span>{" "}
            with other documents
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
      {analysis.overallSummary && (
        <div className="space-y-1 text-sm">
          <p className="font-medium text-gray-800">Overall Summary</p>
          <p className="text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
            {analysis.overallSummary}
          </p>
        </div>
      )}

      {/* Pair details / similarities */}
      {similarities.length > 0 && (
        <div className="space-y-2 text-sm">
          <p className="font-medium text-gray-800">Document Similarities</p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {similarities.map((s, idx) => {
              const doc1 = s.document1 || (s.pair && s.pair[0]);
              const doc2 = s.document2 || (s.pair && s.pair[1]);
              const percent =
                s.similarityPercentage ?? s.similarity ?? s.score ?? null;

              return (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg px-3 py-2"
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {doc1?.fileName || doc1} ↔ {doc2?.fileName || doc2}
                  </p>
                  {percent != null && (
                    <p className="text-xs text-gray-700 mt-1">
                      Similarity:{" "}
                      <span className="font-medium">{percent}%</span>
                    </p>
                  )}
                  {s.comment && (
                    <p className="text-xs text-gray-600 mt-1">{s.comment}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="space-y-1 text-sm">
          <p className="font-medium text-gray-800">Recommendations</p>
          <ul className="list-disc list-inside space-y-1 text-gray-800 bg-yellow-50 rounded-lg p-3">
            {analysis.recommendations.map((r: string, idx: number) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

