import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useState } from "react";
import {
  GradeTemplateRubricProps,
  RubricCriteriaItemProps,
} from "@/types/grade";

export default function GradeTemplateRubric({
  criteria = [],
  totalRange = { min: 0, max: 100 },
}: GradeTemplateRubricProps) {
  const [scores, setScores] = useState<Record<string, number>>(
    criteria.reduce((acc, criterion) => {
      acc[criterion.key] = 0;
      return acc;
    }, {} as Record<string, number>)
  );
  const [feedback, setFeedback] = useState("");

  const handleScoreChange = (key: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const totalScore = Object.values(scores).reduce(
    (sum, score) => sum + score,
    0
  );

  const maxPossibleScore = criteria.reduce((sum, c) => sum + c.maxPoints, 0);

  const handleSaveGrade = () => {
    // TODO: Implement save functionality
    console.log("Saving grade:", { scores, totalScore, feedback });
  };

  const handlePublishGrade = () => {
    // TODO: Implement publish functionality
    console.log("Publishing grade:", { scores, totalScore, feedback });
  };

  return (
    <div className="w-full  flex flex-col items-start p-6">
      <p className="text-[#0C0C0C] text-lg font-semibold mb-6">Rubric Editor</p>

      <div className="flex flex-col gap-6 w-full">
        {/* Criteria Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">💡</span>
            <span className="text-sm text-gray-600">
              Enter scores for each criterion (0 to max points)
            </span>
          </div>

          {criteria.map((criterion) => (
            <RubricCriteriaItem
              key={criterion.key}
              name={criterion.label}
              value={scores[criterion.key] || 0}
              min={0}
              max={criterion.maxPoints}
              onChange={(value) => handleScoreChange(criterion.key, value)}
            />
          ))}
        </div>

        {/* Feedback Section */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Feedback Comments
          </label>
          <Textarea
            placeholder="Provide detailed feedback for the student..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full min-h-[100px]"
          />
        </div>

        {/* Total Score Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Score:</span>
            <span className="text-xl font-bold text-blue-600">
              {totalScore} / {maxPossibleScore}
            </span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(totalScore / maxPossibleScore) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {totalScore > 0
                ? `${Math.round(
                    (totalScore / maxPossibleScore) * 100
                  )}% completed`
                : "No scores entered yet"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 ">
          <Button
            onClick={handleSaveGrade}
            variant="secondary"
            className="flex-1"
          >
            Save Grade
          </Button>
          <Button
            onClick={handlePublishGrade}
            variant="primary"
            className="flex-1"
          >
            Publish Grade
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RubricCriteriaItem({
  name,
  value,
  min = 0,
  max = 10,
  onChange,
}: RubricCriteriaItemProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <label className="font-medium text-gray-700">{name}</label>
        <span className="text-sm text-gray-500">
          {min} - {max} points
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex-1 border border-[#DBDBDB] rounded-[10px] py-3.5 px-4 bg-gray-50">
          <span className="text-gray-600">
            Enter score for {name.toLowerCase()}
          </span>
        </div>
        <div className="w-24">
          <Input
            className="w-full text-center"
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder="0"
          />
        </div>
        <div className="text-sm text-gray-500 min-w-[60px]">/ {max}</div>
      </div>
      {Number(value) > max && (
        <p className="text-red-500 text-xs">
          ⚠️ Score cannot exceed {max} points
        </p>
      )}
    </div>
  );
}
