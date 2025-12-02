"use client";

import { useState, useEffect } from "react";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import { Sparkles, Loader2, X, Bookmark } from "lucide-react";
import { useGradingTemplates } from "@/hooks/useUser";
import {
  GradingTemplate,
  GradingTemplateType,
  GradingTemplateCriteria,
} from "@/types/gradingTemplate";
import { runAIGrader } from "@/services/aiAnalysis.service";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { gradingTypeOptions } from "@/lib/gradingTypeOptions";
import SaveTemplateModal from "@/modules/dashboard/teacher/gradingTemplates/SaveTemplateModal";
import { useUserSinglePostData } from "@/hooks/useUser";

interface RunAIGraderModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  documentId: string;
  fileName: string;
  postId?: string;
}

export default function RunAIGraderModal({
  isOpen,
  onOpenChange,
  documentId,
  fileName,
  postId,
}: RunAIGraderModalProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [gradingType, setGradingType] =
    useState<GradingTemplateType>("numeric");
  const [numericCriteria, setNumericCriteria] = useState<{
    min?: number;
    max?: number;
  }>({});

  const [letterRanges, setLetterRanges] = useState<
    { letter: string; min: number; max: number }[]
  >([{ letter: "A", min: 90, max: 100 }]);

  const [rubricCriteria, setRubricCriteria] = useState<
    { label: string; maxPoints: number; minPoints?: number; weight?: number }[]
  >([{ label: "Criterion 1", maxPoints: 10, minPoints: 0, weight: 0 }]);

  const [checklistItems, setChecklistItems] = useState<string[]>([""]);
  const [passFailValue, setPassFailValue] = useState<"pass" | "fail">("pass");
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { gradingTemplates, isGradingTemplatesLoading } = useGradingTemplates();

  // Fetch post data if postId is provided
  const {
    userSinglePostData: postData,
    isUserSinglePostDataLoading: isPostLoading,
  } = useUserSinglePostData(postId || "");

  // Check if post has grading template
  const postGradingTemplate = postData?.gradingTemplate;
  const hasPostTemplate =
    !!postGradingTemplate?.type && !!postGradingTemplate?.criteria;

  const buildCriteria = (): GradingTemplateCriteria => {
    switch (gradingType) {
      case "numeric":
        return {
          numericCriteria:
            numericCriteria.min != null && numericCriteria.max != null
              ? {
                  min: numericCriteria.min,
                  max: numericCriteria.max,
                }
              : undefined,
        };
      case "letter":
        return {
          letterRanges: letterRanges.filter(
            (r) =>
              r.letter && typeof r.min === "number" && typeof r.max === "number"
          ),
        };
      case "rubric":
      case "weightedRubric":
        return {
          rubricCriteria: rubricCriteria.filter((c) => c.label && c.maxPoints),
        };
      case "checklist":
        return {
          checklistItems: checklistItems.filter((c) => c.trim().length > 0),
        };
      case "passFail":
      default:
        return {};
    }
  };

  const canSaveTemplate = () => {
    const criteria = buildCriteria();
    if (gradingType === "numeric") {
      return !!criteria.numericCriteria;
    }
    if (gradingType === "letter") {
      return !!criteria.letterRanges && criteria.letterRanges.length > 0;
    }
    if (gradingType === "rubric" || gradingType === "weightedRubric") {
      return !!criteria.rubricCriteria && criteria.rubricCriteria.length > 0;
    }
    if (gradingType === "checklist") {
      return !!criteria.checklistItems && criteria.checklistItems.length > 0;
    }
    return false;
  };

  const handleRun = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsRunning(true);
    try {
      // If post has grading template, use it directly
      if (hasPostTemplate && postGradingTemplate) {
        await runAIGrader({
          documentId,
          prompt: prompt.trim(),
          gradingTemplateId: undefined, // Don't use saved template ID, use post's template
          gradingType: postGradingTemplate.type as GradingTemplateType,
          criteria: postGradingTemplate.criteria as GradingTemplateCriteria,
        });
      } else {
        // Otherwise, use selected template or custom criteria
        const criteria = buildCriteria();
        const hasTemplate = !!selectedTemplateId;

        await runAIGrader({
          documentId,
          prompt: prompt.trim(),
          gradingTemplateId: hasTemplate ? selectedTemplateId : undefined,
          gradingType: hasTemplate ? undefined : gradingType,
          criteria: hasTemplate ? undefined : criteria,
        });
      }
      toast.success("AI Grader started successfully!");
      queryClient.invalidateQueries({ queryKey: ["ai-analysis-results"] });
      queryClient.invalidateQueries({ queryKey: ["ai-grader-results"] });
      queryClient.invalidateQueries({ queryKey: ["user-documents"] });
      queryClient.invalidateQueries({ queryKey: ["ai-analysis-stats"] });
      onOpenChange(false);
      setPrompt("");
      setSelectedTemplateId("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to start AI Grader"
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <ResponsiveModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Run AI Grader"
      >
        <div className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] max-h-screen overflow-y-scroll scrollbar-hide p-6 sm:p-10 rounded-[27px] flex flex-col">
          {/* Header */}
          <div className="flex flex-row justify-between mb-6">
            <div className="flex flex-col gap-1.5">
              <p className="text-xl text-[#0c0c0c] font-medium">
                Run AI Grader
              </p>
              <p className="text-base font-normal text-[#717171]">
                Grade {fileName} using AI-powered analysis
              </p>
            </div>
            <div onClick={() => onOpenChange(false)}>
              <X
                width={22}
                height={22}
                className="text-[#000000] cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Prompt <span className="text-red-500">*</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter instructions for AI grading (e.g., 'Grade this assignment based on clarity, grammar, and content quality')"
                className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isRunning}
              />
              <p className="text-xs text-gray-500">
                Provide clear instructions for how the AI should grade this
                document
              </p>
            </div>

            {/* Loading Post Data */}
            {postId && isPostLoading && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading post information...</span>
                </div>
              </div>
            )}

            {/* Post Template Info */}
            {hasPostTemplate && postGradingTemplate && !isPostLoading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Using Post&apos;s Grading Template
                </p>
                <p className="text-xs text-blue-700">
                  This document is associated with a post that has a grading
                  template. The post&apos;s template will be used automatically.
                </p>
                {postData?.title && (
                  <p className="text-xs text-blue-600 mt-1">
                    Post: {postData.title}
                  </p>
                )}
              </div>
            )}

            {/* Grading Template Selection + Type - Only show if post doesn't have template */}
            {!hasPostTemplate && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Grading Template (Optional)
                    </label>
                    {isGradingTemplatesLoading ? (
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Loading templates...</span>
                      </div>
                    ) : (
                      <select
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isRunning}
                      >
                        <option value="">None - Use custom criteria</option>
                        {gradingTemplates?.map((template: GradingTemplate) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                            {template.description &&
                              ` - ${template.description}`}
                          </option>
                        ))}
                      </select>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Choose a saved template, or leave empty to define custom
                      grading criteria below.
                    </p>
                  </div>
                </div>

                {/* Custom Grading Type & Criteria (only when no template selected) */}
                {!selectedTemplateId && (
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-800">
                        Grading Logic Type
                      </p>
                      {canSaveTemplate() && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsSaveTemplateOpen(true)}
                          className="text-xs px-3 py-1 h-auto"
                          icon={<Bookmark size={14} />}
                          disabled={isRunning}
                        >
                          Save as Template
                        </Button>
                      )}
                    </div>

                    <CustomSelect
                      options={gradingTypeOptions}
                      defaultValue={gradingTypeOptions.find(
                        (o) => o.value === gradingType
                      )}
                      onChange={(val) => {
                        setGradingType(
                          (val?.value as GradingTemplateType) || "numeric"
                        );
                      }}
                    />

                    {/* Dynamic criteria inputs */}
                    {gradingType === "numeric" && (
                      <div className="flex gap-4">
                        <Input
                          label="Min Points"
                          type="number"
                          value={numericCriteria.min ?? ""}
                          onChange={(e) =>
                            setNumericCriteria((prev) => ({
                              ...prev,
                              min:
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                            }))
                          }
                        />
                        <Input
                          label="Max Points"
                          type="number"
                          value={numericCriteria.max ?? ""}
                          onChange={(e) =>
                            setNumericCriteria((prev) => ({
                              ...prev,
                              max:
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                    )}

                    {gradingType === "letter" && (
                      <div className="flex flex-col gap-2">
                        {letterRanges.map((range, idx) => (
                          <div
                            key={`letter-range-${idx}`}
                            className="flex gap-2 items-center"
                          >
                            <Input
                              label="Letter"
                              type="text"
                              value={range.letter || ""}
                              onChange={(e) => {
                                const next = [...letterRanges];
                                next[idx] = {
                                  ...next[idx],
                                  letter: e.target.value,
                                };
                                setLetterRanges(next);
                              }}
                            />
                            <Input
                              label="Min"
                              type="number"
                              value={range.min ?? ""}
                              onChange={(e) => {
                                const next = [...letterRanges];
                                next[idx] = {
                                  ...next[idx],
                                  min:
                                    e.target.value === ""
                                      ? (undefined as any)
                                      : Number(e.target.value),
                                };
                                setLetterRanges(next);
                              }}
                            />
                            <Input
                              label="Max"
                              type="number"
                              value={range.max ?? ""}
                              onChange={(e) => {
                                const next = [...letterRanges];
                                next[idx] = {
                                  ...next[idx],
                                  max:
                                    e.target.value === ""
                                      ? (undefined as any)
                                      : Number(e.target.value),
                                };
                                setLetterRanges(next);
                              }}
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() =>
                            setLetterRanges((prev) => [
                              ...prev,
                              { letter: "", min: 0, max: 100 },
                            ])
                          }
                          className="w-fit text-xs"
                        >
                          Add Range
                        </Button>
                      </div>
                    )}

                    {(gradingType === "rubric" ||
                      gradingType === "weightedRubric") && (
                      <div className="flex flex-col gap-2">
                        {rubricCriteria.map((item, idx) => (
                          <div
                            key={`rubric-${idx}`}
                            className="flex flex-col sm:flex-row gap-2"
                          >
                            <Input
                              label="Label"
                              value={item.label || ""}
                              onChange={(e) => {
                                const next = [...rubricCriteria];
                                next[idx] = {
                                  ...next[idx],
                                  label: e.target.value,
                                };
                                setRubricCriteria(next);
                              }}
                            />
                            <Input
                              label="Min Points"
                              type="number"
                              value={item.minPoints ?? ""}
                              onChange={(e) => {
                                const next = [...rubricCriteria];
                                next[idx] = {
                                  ...next[idx],
                                  minPoints:
                                    e.target.value === ""
                                      ? (undefined as any)
                                      : Number(e.target.value),
                                };
                                setRubricCriteria(next);
                              }}
                            />
                            <Input
                              label="Max Points"
                              type="number"
                              value={item.maxPoints ?? ""}
                              onChange={(e) => {
                                const next = [...rubricCriteria];
                                next[idx] = {
                                  ...next[idx],
                                  maxPoints:
                                    e.target.value === ""
                                      ? (undefined as any)
                                      : Number(e.target.value),
                                };
                                setRubricCriteria(next);
                              }}
                            />
                            {gradingType === "weightedRubric" && (
                              <Input
                                label="Weight (%)"
                                type="number"
                                value={item.weight ?? ""}
                                onChange={(e) => {
                                  const next = [...rubricCriteria];
                                  next[idx] = {
                                    ...next[idx],
                                    weight:
                                      e.target.value === ""
                                        ? (undefined as any)
                                        : Number(e.target.value),
                                  };
                                  setRubricCriteria(next);
                                }}
                              />
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() =>
                            setRubricCriteria((prev) => [
                              ...prev,
                              { label: "", maxPoints: 10, minPoints: 0 },
                            ])
                          }
                          className="w-fit text-xs"
                        >
                          Add Criterion
                        </Button>
                      </div>
                    )}

                    {gradingType === "checklist" && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                          Checklist Items
                        </label>
                        {checklistItems.map((item, idx) => (
                          <div
                            key={`checklist-${idx}`}
                            className="flex items-center gap-2"
                          >
                            <Input
                              type="text"
                              placeholder={`Criterion ${idx + 1}`}
                              value={item || ""}
                              onChange={(e) => {
                                const next = [...checklistItems];
                                next[idx] = e.target.value;
                                setChecklistItems(next);
                              }}
                            />
                            <Button
                              type="button"
                              variant="red"
                              onClick={() =>
                                setChecklistItems((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                )
                              }
                              className="px-2 py-1 h-auto text-xs"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setChecklistItems((prev) => [...prev, ""])
                          }
                          className="w-fit text-xs"
                        >
                          Add Item
                        </Button>
                      </div>
                    )}

                    {gradingType === "passFail" && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Pass/Fail Criteria
                        </label>
                        <CustomSelect
                          options={[
                            { value: "pass", label: "Pass" },
                            { value: "fail", label: "Fail" },
                          ]}
                          defaultValue={{ value: passFailValue, label: "Pass" }}
                          onChange={(val) =>
                            setPassFailValue(
                              (val?.value as "pass" | "fail") || "pass"
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleRun}
              disabled={isRunning || !prompt.trim()}
              className="w-full"
              variant="primary"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Grade
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Save Template Modal */}
        <ResponsiveModal
          isOpen={isSaveTemplateOpen}
          onOpenChange={setIsSaveTemplateOpen}
          title="Save Grading Template"
        >
          <SaveTemplateModal
            gradingType={gradingType}
            criteria={buildCriteria()}
            onClose={() => setIsSaveTemplateOpen(false)}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["gradingTemplates"] });
            }}
          />
        </ResponsiveModal>
      </ResponsiveModal>
    </>
  );
}
