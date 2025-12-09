"use client";

import { AIAnalysisResult } from "@/types/aiAnalysis.type";
import { X, AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface AIContentDetectorResultModalProps {
  result: AIAnalysisResult;
  onClose?: () => void;
}
// {"json":{"rawResult":{"summary":"","aiPercentage":100,"humanPercentage":0,"detailedSections":[{"index":5,"content":"I was s itting at my desk in freshman ELA class, as confident as America's Top Model walking down the runway. It was the end of class and I was excited to see how well I did on the first quiz of the year.","location":"First essay introduction","indicators":["Overuse of metaphor comparing grades with fireworks"]},{"index":6,"content":"My world was crashing down. My first thought, which I quickly dismissed, was that I needed to transfer.","location":"Continuation from the essay about struggling for an A","indicators":["Vague language expressing personal feelings without specific detail"]}],"aiGeneratedSections":[{"5":"I was s itting at my desk in freshman ELA class, as confident as America's Top Model walking down the runway. It was the end of class and I was excited to see how well I did on the first quiz of the year.","location":"First essay introduction","indicators":["Overuse of metaphor comparing grades with fireworks"]},{"6":"My world was crashing down. My first thought, which I quickly dismissed, was that I needed to transfer.","location":"Continuation from the essay about struggling for an A","indicators":["Vague language expressing personal feelings without specific detail"]}]},"metadata":{"model":"phi3.5","promptSnippet":"how many content is the ai content in the foloowing doc"},"createdAt":"2025-12-08T12:45:41.133Z"}}

export default function AIContentDetectorResultModal({
  result,
  onClose,
}: AIContentDetectorResultModalProps) {
  const detection: any =
    result.result?.rawResult ||
    result.result?.json?.rawResult ||
    result.result?.detector?.rawResult ||
    result.result ||
    {};
  console.log(detection, result, "detection");
  const aiPercentage = Number(detection.aiPercentage) || 0;
  // Use humanPercentage from JSON if available, otherwise calculate from aiPercentage
  const humanPercentage =
    detection.humanPercentage != null
      ? Number(detection.humanPercentage)
      : 100 - aiPercentage;
  const detailedSections = detection.detailedSections || [];
  const aiGeneratedSections = detection.aiGeneratedSections || [];

  // Prepare data for pie chart
  const pieData = [
    { name: "AI Generated", value: aiPercentage, color: "#9333ea" }, // purple-600
    { name: "Human Written", value: humanPercentage, color: "#10b981" }, // emerald-500
  ];

  const COLORS = ["#9333ea", "#10b981"];

  // Custom label function for pie chart
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] max-h-screen overflow-y-scroll scrollbar-hide p-6 sm:p-10 rounded-[27px] flex flex-col space-y-6 relative">
      {/* Close Button - Top Right */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-700 transition-colors z-10"
        aria-label="Close"
      >
        <X width={22} height={22} />
      </button>

      {/* Header */}
      <div className="flex flex-col gap-1.5 pr-8">
        <p className="text-xl text-[#0c0c0c] font-medium">
          AI Content Detector Result
        </p>
        <p className="text-sm text-[#717171]">
          Analysis of AI-generated content in{" "}
          <span className="font-semibold text-[#0c0c0c]">
            {result.fileName}
          </span>
        </p>
      </div>

      {/* Overall Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl px-4 py-3 border border-purple-200">
          <p className="text-xs text-purple-700 font-medium mb-1">
            AI Content Percentage
          </p>
          <p className="text-2xl font-bold text-purple-900">{aiPercentage}%</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl px-4 py-3 border border-emerald-200">
          <p className="text-xs text-emerald-700 font-medium mb-1">
            Human Written Percentage
          </p>
          <p className="text-2xl font-bold text-emerald-900">
            {humanPercentage}%
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm font-semibold text-gray-800 text-center">
            Content Distribution
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value}%`}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm text-gray-700">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Indicator */}
      <div
        className={`rounded-xl px-4 py-4 border-2 ${
          aiPercentage >= 50
            ? "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-300"
            : aiPercentage >= 25
            ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300"
            : "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300"
        }`}
      >
        <div className="flex items-center gap-3">
          {aiPercentage >= 50 ? (
            <AlertTriangle className="w-8 h-8 text-rose-600" />
          ) : aiPercentage >= 25 ? (
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          ) : (
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          )}
          <div>
            <p className="text-xs font-medium mb-1">
              {aiPercentage >= 50
                ? "HIGH AI CONTENT DETECTED"
                : aiPercentage >= 25
                ? "MODERATE AI CONTENT DETECTED"
                : "LOW AI CONTENT DETECTED"}
            </p>
            <p className="text-lg font-bold">
              {aiPercentage >= 50
                ? "Significant AI-generated content found"
                : aiPercentage >= 25
                ? "Some AI-generated content detected"
                : "Primarily human-written content"}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed AI-Generated Sections */}
      {detailedSections.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <p className="text-base font-semibold text-gray-800">
              Flagged AI-Generated Sections
            </p>
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
              {detailedSections.length} section
              {detailedSections.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {detailedSections.map((section: any, idx: number) => {
              // Use the index from the section if available, otherwise use array index
              const sectionIndex =
                section.index != null ? section.index : idx + 1;

              return (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-semibold bg-purple-200 text-purple-800 rounded">
                        Section {sectionIndex}
                      </span>
                      {section.location && (
                        <span className="text-xs text-gray-600">
                          {section.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {section.content && (
                    <p className="text-sm text-gray-800 whitespace-pre-wrap mb-2 bg-white rounded p-2 border border-purple-100">
                      {section.content}
                    </p>
                  )}
                  {section.indicators && section.indicators.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-purple-700 mb-1">
                        Detection Indicators:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {section.indicators.map(
                          (indicator: string, i: number) => (
                            <li key={i} className="text-xs text-gray-700">
                              {indicator}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Generated Sections (Alternative format) */}
      {aiGeneratedSections.length > 0 && detailedSections.length === 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <p className="text-base font-semibold text-gray-800">
              AI-Generated Content Sections
            </p>
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
              {aiGeneratedSections.length} section
              {aiGeneratedSections.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {aiGeneratedSections.map((section: any, idx: number) => {
              // Handle the structure where numeric keys are properties
              // e.g., { "5": "content...", "location": "...", "indicators": [...] }
              const numericKeys = Object.keys(section).filter(
                (key) => !isNaN(Number(key))
              );
              const sectionKey = numericKeys[0] || String(idx + 1);
              const sectionContent =
                typeof section[sectionKey] === "string"
                  ? section[sectionKey]
                  : section.content || section[sectionKey] || "";

              return (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-200 text-purple-800 rounded">
                      Section {sectionKey}
                    </span>
                    {section.location && (
                      <span className="text-xs text-gray-600">
                        {section.location}
                      </span>
                    )}
                  </div>
                  {sectionContent && (
                    <p className="text-sm text-gray-800 whitespace-pre-wrap bg-white rounded p-2 border border-purple-100 mb-2">
                      {sectionContent}
                    </p>
                  )}
                  {section.indicators && section.indicators.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-purple-700 mb-1">
                        Detection Indicators:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {section.indicators.map(
                          (indicator: string, i: number) => (
                            <li key={i} className="text-xs text-gray-700">
                              {indicator}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Text */}
      {detection.summary && (
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-gray-800">Analysis Summary</p>
          <p className="text-gray-700 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap border border-gray-200">
            {detection.summary}
          </p>
        </div>
      )}
    </div>
  );
}
