import { useState, useCallback } from "react";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import MobileInput from "@/components/ui/MobileInput";
import MobileButton from "@/components/ui/MobileButton";
import MobileCustomSelect from "@/components/ui/MobileCustomSelect";
import MobileTextarea from "@/components/ui/MobileTextarea";
import { useSubjectDomains } from "@/hooks/usePublicRoutes";
import { SubjectDomain } from "@/types/typeLog";
import { User } from "@/app/types/user";
import {
  useUserCreatePost,
  useUserData,
  useUserRemoveUploadedFile,
  useUserUploadFile,
} from "@/hooks/useUser";
import { useForm, Controller } from "react-hook-form";
import { PostCreateInput } from "@/types/postAttributes";
import toast from "react-hot-toast";
import { gradingTypeOptions } from "@/lib/gradingTypeOptions";
import FileUploader from "@/components/FileUploader";

interface MobileCreatePostProps {
  onBack: () => void;
}

export default function MobileCreatePost({ onBack }: MobileCreatePostProps) {
  const [uploadIds, setUploadIds] = useState<string[]>([]);
  const [isFileBusy, setIsFileBusy] = useState(false);

  const [domain, setDomain] = useState<string | boolean>("");
  const [selectedGradingType, setSelectedGradingType] = useState<
    string | boolean
  >("numeric");
  const [gradingTemplate, setGradingTemplate] = useState<Record<string, any>>(
    {}
  );
  const [userGrade, setUserGrade] = useState<Record<string, any>>({});

  const [numericCriteria, setNumericCriteria] = useState<any>({});
  const [letterRanges, setLetterRanges] = useState([
    { letter: "A", min: 90, max: 100 },
  ]);
  const [rubricCriteria, setRubricCriteria] = useState([
    { label: "Criterion 1", maxPoints: 10, weight: 0 },
  ]);
  const [checklistItems, setChecklistItems] = useState<string[]>([""]);

  const { subjectDomains } = useSubjectDomains();
  const { user } = useUserData();
  const { createPostAsync, isCreatingPostLoading } = useUserCreatePost(domain);

  const optionsSubjectDomains =
    subjectDomains
      ?.filter((sd: SubjectDomain) =>
        (user as User)?.domains?.some((d: SubjectDomain) => d.id === sd.id)
      )
      .map((sd: SubjectDomain) => ({
        value: sd.id,
        label: sd.name,
      })) ?? [];

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<PostCreateInput>();

  const handleUploadIdsChange = useCallback((ids: string[]) => {
    setUploadIds((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(ids)) {
        return ids;
      }
      return prev;
    });
  }, []);

  const addLetterRange = () =>
    setLetterRanges([...letterRanges, { letter: "", min: 0, max: 0 }]);

  const updateLetterRange = (index: number, field: string, value: any) => {
    const updated = [...letterRanges];
    (updated[index] as any)[field] = value;
    setLetterRanges(updated);
  };

  const addRubricItem = () =>
    setRubricCriteria([
      ...rubricCriteria,
      { label: "", maxPoints: 10, weight: 0 },
    ]);

  const updateRubric = (index: number, field: string, value: any) => {
    const updated = [...rubricCriteria];
    (updated[index] as any)[field] = value;
    setRubricCriteria(updated);
  };

  const handleChecklistChange = (index: number, value: string) => {
    const updated = [...checklistItems];
    updated[index] = value;
    setChecklistItems(updated);
  };

  const addChecklistItem = () => setChecklistItems([...checklistItems, ""]);
  const removeChecklistItem = (index: number) =>
    setChecklistItems(checklistItems.filter((_, i) => i !== index));

  const onSubmit = async (data: PostCreateInput) => {
    // Compose gradingTemplate based on selected type
    let composedGradingTemplate: Record<string, any> = {};

    switch (selectedGradingType) {
      case "numeric":
        composedGradingTemplate = { numericCriteria };
        break;
      case "letter":
        composedGradingTemplate = { letterRanges };
        break;
      case "rubric":
      case "weightedRubric":
        composedGradingTemplate = { rubricCriteria };
        break;
      case "checklist":
        composedGradingTemplate = { checklistItems };
        break;
      case "passFail":
        composedGradingTemplate = {};
        break;
    }

    try {
      if (uploadIds.length === 0) {
        toast.error("Please upload at least one file!");
        return;
      }

      const postData = {
        ...data,
        grading: {
          criteria: composedGradingTemplate,
          gradingType: selectedGradingType,
        },
        uploadIds,
        userGrade,
      };

      await createPostAsync(postData);
      toast.success("Post created successfully!");

      // Reset form and go back
      reset();
      setUploadIds([]);
      onBack();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] p-4">
      {/* Mobile Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-[#0C0C0C]">
            Create New Post
          </h1>
          <p className="text-xs text-[#717171]">
            Upload exams & share with teachers
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#FDFDFD] rounded-[27px] p-6 space-y-5"
      >
        {/* Title */}
        <MobileInput
          label="Title *"
          type="text"
          placeholder="Moderate Post Title"
          {...register("title", { required: "Title is required!" })}
          error={errors?.title?.message}
        />

        {/* Description */}
        <MobileTextarea
          label="Description *"
          placeholder="Post description"
          {...register("description", { required: "Description is required!" })}
          error={errors?.description?.message}
          rows={4}
        />

        {/* Tags */}
        <MobileInput
          label="Tags"
          type="text"
          placeholder="Enter tags separated by commas"
          {...register("tags", {
            setValueAs: (v: unknown) =>
              typeof v === "string" && v.length > 0
                ? v
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                : [],
          })}
          error={errors?.tags?.message}
        />

        {/* Subject Domain */}
        <div>
          <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
            Subject Domain *
          </label>
          <Controller
            name="domain"
            control={control}
            render={({ field }) => (
              <MobileCustomSelect
                options={optionsSubjectDomains}
                onChange={(val) => {
                  field.onChange(val?.value);
                  setDomain(val?.value || "");
                }}
                placeholder="Select subject..."
              />
            )}
          />
        </div>

        {/* Grading Type */}
        <div>
          <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
            Grading Logic Type *
          </label>
          <Controller
            name="gradingType"
            control={control}
            render={({ field }) => (
              <MobileCustomSelect
                options={gradingTypeOptions}
                defaultValue={gradingTypeOptions[0]}
                onChange={(val) => {
                  field.onChange(val?.value);
                  setSelectedGradingType(val?.value || "");
                  setGradingTemplate({});
                }}
                placeholder="Select grading type..."
              />
            )}
          />
        </div>

        {/* Dynamic Grading Inputs - Numeric */}
        {selectedGradingType === "numeric" && (
          <div className="flex gap-3">
            <MobileInput
              label="Min Points"
              type="number"
              placeholder="0"
              onChange={(e) =>
                setNumericCriteria((prev: any) => ({
                  ...prev,
                  min:
                    e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
            />
            <MobileInput
              label="Max Points"
              type="number"
              placeholder="100"
              onChange={(e) =>
                setNumericCriteria((prev: any) => ({
                  ...prev,
                  max:
                    e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
            />
          </div>
        )}

        {/* Letter Grading */}
        {selectedGradingType === "letter" && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[#0C0C0C]">
              Letter Ranges
            </label>
            {letterRanges.map((range, idx) => (
              <div key={idx} className="flex gap-2">
                <MobileInput
                  label="Letter"
                  type="text"
                  value={range.letter}
                  onChange={(e) =>
                    updateLetterRange(idx, "letter", e.target.value)
                  }
                />
                <MobileInput
                  label="Min"
                  type="number"
                  value={range.min}
                  onChange={(e) =>
                    updateLetterRange(
                      idx,
                      "min",
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                />
                <MobileInput
                  label="Max"
                  type="number"
                  value={range.max}
                  onChange={(e) =>
                    updateLetterRange(
                      idx,
                      "max",
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                />
              </div>
            ))}
            <MobileButton
              type="button"
              onClick={addLetterRange}
              variant="outline"
            >
              <Plus size={16} /> Add Range
            </MobileButton>
          </div>
        )}

        {/* Rubric & Weighted Rubric */}
        {(selectedGradingType === "rubric" ||
          selectedGradingType === "weightedRubric") && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[#0C0C0C]">
              Rubric Criteria
            </label>
            {rubricCriteria.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <MobileInput
                  label="Label"
                  value={item.label}
                  onChange={(e) => updateRubric(idx, "label", e.target.value)}
                />
                <div className="flex gap-2">
                  <MobileInput
                    label="Min Points"
                    type="number"
                    value={item.maxPoints}
                    onChange={(e) =>
                      updateRubric(
                        idx,
                        "minPoints",
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                  <MobileInput
                    label="Max Points"
                    type="number"
                    value={item.maxPoints}
                    onChange={(e) =>
                      updateRubric(
                        idx,
                        "maxPoints",
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                  {selectedGradingType === "weightedRubric" && (
                    <MobileInput
                      label="Weight (%)"
                      type="number"
                      value={item.weight}
                      onChange={(e) =>
                        updateRubric(
                          idx,
                          "weight",
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                    />
                  )}
                </div>
              </div>
            ))}
            <MobileButton
              type="button"
              onClick={addRubricItem}
              variant="outline"
            >
              <Plus size={16} /> Add Criterion
            </MobileButton>
          </div>
        )}

        {/* Checklist */}
        {selectedGradingType === "checklist" && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#0C0C0C]">
              Checklist Items
            </label>
            {checklistItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <MobileInput
                  type="text"
                  placeholder={`Criterion ${idx + 1}`}
                  value={item}
                  onChange={(e) => handleChecklistChange(idx, e.target.value)}
                />
                <MobileButton
                  type="button"
                  variant="red"
                  onClick={() => removeChecklistItem(idx)}
                  className="px-3"
                >
                  <Trash size={16} />
                </MobileButton>
              </div>
            ))}
            <MobileButton
              type="button"
              variant="outline"
              onClick={addChecklistItem}
            >
              <Plus size={16} /> Add Item
            </MobileButton>
          </div>
        )}

        {/* Pass/Fail */}
        {selectedGradingType === "passFail" && (
          <div>
            <label className="text-sm font-medium text-[#0C0C0C] mb-2 block">
              Pass/Fail Criteria
            </label>
            <p className="text-xs text-[#717171] mb-2">----</p>
          </div>
        )}

        {/* User's Grade - Numeric */}
        {selectedGradingType === "numeric" && (
          <MobileInput
            label="Your Grade"
            type="number"
            placeholder="Enter your grade"
            value={userGrade.numeric || ""}
            onChange={(e) =>
              setUserGrade((prev) => ({
                ...prev,
                numeric:
                  e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
          />
        )}

        {/* User's Grade - Letter */}
        {selectedGradingType === "letter" && (
          <div>
            <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
              Your Grade (Letter)
            </label>
            <MobileCustomSelect
              options={letterRanges.map((r) => ({
                value: r.letter,
                label: r.letter,
              }))}
              defaultValue={
                userGrade.letter
                  ? { value: userGrade.letter, label: userGrade.letter }
                  : undefined
              }
              onChange={(val) =>
                setUserGrade((prev) => ({
                  ...prev,
                  letter: typeof val?.value === "string" ? val.value : "",
                }))
              }
              placeholder="Select grade..."
            />
          </div>
        )}

        {/* User's Grade - Rubric */}
        {(selectedGradingType === "rubric" ||
          selectedGradingType === "weightedRubric") && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#0C0C0C]">
              Your Grade (Rubric)
            </label>
            {rubricCriteria.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-xs text-[#717171] w-32 truncate">
                  {item.label}
                </span>
                <MobileInput
                  label="Score"
                  type="number"
                  placeholder={`0 - ${item.maxPoints}`}
                  value={userGrade.rubric?.[idx] || ""}
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value);
                    setUserGrade((prev) => {
                      const updated = [...(prev.rubric || [])];
                      updated[idx] = value;
                      return { ...prev, rubric: updated };
                    });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* User's Grade - Checklist */}
        {selectedGradingType === "checklist" && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#0C0C0C]">
              Checklist Grades
            </label>
            {checklistItems.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center gap-2"
              >
                <span className="text-xs text-[#717171] sm:w-32 sm:truncate">
                  {item}
                </span>
                <div className="w-full sm:w-auto">
                  <MobileCustomSelect
                    options={[
                      { value: "done", label: "Done" },
                      { value: "pending", label: "Pending" },
                    ]}
                    defaultValue={
                      userGrade.checklist?.[idx]
                        ? {
                            value: userGrade.checklist[idx],
                            label: userGrade.checklist[idx],
                          }
                        : undefined
                    }
                    onChange={(val) => {
                      const value = val?.value;
                      setUserGrade((prev) => {
                        const updated = [...(prev.checklist || [])];
                        updated[idx] = value;
                        return { ...prev, checklist: updated };
                      });
                    }}
                    placeholder="Select..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* User's Grade - Pass/Fail */}
        {selectedGradingType === "passFail" && (
          <div>
            <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
              Your Grade (Pass/Fail)
            </label>
            <MobileCustomSelect
              options={[
                { value: "pass", label: "Pass" },
                { value: "fail", label: "Fail" },
              ]}
              defaultValue={{ value: "pass", label: "Pass" }}
              onChange={(val) =>
                setUserGrade((prev) => ({
                  ...prev,
                  passFail: typeof val?.value === "string" ? val.value : "",
                }))
              }
              placeholder="Select..."
            />
          </div>
        )}

        {/* File Upload */}
        <FileUploader
          label="Upload Documents *"
          accept="image/*,application/pdf,.doc,.docx"
          onUploadIdsChange={handleUploadIdsChange}
          onLoadingChange={setIsFileBusy}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <MobileButton
            type="button"
            variant="secondary"
            onClick={onBack}
            className="flex-1"
          >
            Cancel
          </MobileButton>
          <MobileButton
            type="submit"
            variant="primary"
            disabled={isCreatingPostLoading || isFileBusy}
            className={`flex-1 ${
              isCreatingPostLoading || isFileBusy ? "opacity-70" : ""
            }`}
          >
            {isCreatingPostLoading ? "Creating..." : "Create Post"}
          </MobileButton>
        </div>
      </form>
    </div>
  );
}
