"use client";

import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { useResponsiveModal } from "@/hooks/useResponsiveModal";
import { Trash, Plus, X, Bookmark, FolderOpen } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import FileUploader from "@/components/FileUploader";
import CustomSelect from "@/components/ui/CustomSelect";
import { useSubjectDomains } from "@/hooks/usePublicRoutes";
import { SubjectDomain } from "@/types/typeLog";
import {
  useUserCreatePost,
  useUserData,
  useUserRemoveUploadedFile,
  useUserUploadFile,
} from "@/hooks/useUser";
import { User } from "@/app/types/user";
import { useCallback, useState } from "react";
import { gradingTypeOptions } from "@/lib/gradingTypeOptions";
import { Controller, useForm } from "react-hook-form";
import { PostAttributes, PostCreateInput } from "@/types/postAttributes";
import toast from "react-hot-toast";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
import TemplateLibraryModal from "../gradingTemplates/TemplateLibraryModal";
import { GradingTemplate, GradingTemplateType } from "@/types/gradingTemplate";
import SaveTemplateModal from "../gradingTemplates/SaveTemplateModal";

export default function CreatPostModal() {
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

  const [maxPoints, setMaxPoints] = useState<number | null>(null);
  const [numericCriteria, setNumericCriteria] = useState<{
    min?: number;
    max?: number;
  }>({});
  const [letterRanges, setLetterRanges] = useState([
    { letter: "A", min: 90, max: 100 },
  ]);
  const [rubricCriteria, setRubricCriteria] = useState<
    Array<{
      label: string;
      maxPoints: number;
      minPoints?: number;
      weight?: number;
    }>
  >([{ label: "Criterion 1", maxPoints: 10, minPoints: 0, weight: 0 }]);
  const [checklistItems, setChecklistItems] = useState<string[]>([""]);
  const [passFailCriteria, setPassFailCriteria] = useState<string | boolean>(
    "pass"
  );

  const [files, setFiles] = useState<File[]>([]);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
  const [isTemplateLibraryModalOpen, setIsTemplateLibraryModalOpen] =
    useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const { close } = useResponsiveModal();
  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };

  //HOOKS

  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
    setValue,
  } = useForm<PostCreateInput>();

  const {
    subjectDomains,
    isLoading: issubjectDomainsLoading,
    isSuccess: issubjectDomainsSuccess,
    isError: issubjectDomainsError,
    error,
  } = useSubjectDomains();

  const { user } = useUserData();

  const {
    createPost,
    createPostAsync,
    creatingPostError,
    isCreatingPostLoading,
    isCreatingPostError,
    isCreatingPostSuccess,
  } = useUserCreatePost(domain);

  const { isUploadingFileLoading } = useUserUploadFile();
  const { isDeletingFileLoading } = useUserRemoveUploadedFile();

  console.log(
    isCreatingPostLoading,
    isCreatingPostLoading,
    isDeletingFileLoading
  );

  const optionsSubjectDomains =
    subjectDomains
      ?.filter((sd: SubjectDomain) =>
        (user as User)?.domains?.some((d: SubjectDomain) => d.id === sd.id)
      )
      .map((sd: SubjectDomain) => ({
        value: sd.id,
        label: sd.name,
      })) ?? [];

  // Handlers
  // const handleSelectedDomains = (values: any[]) =>
  //   setDomains(values.map((v) => v.value));

  const handleGradingTypeChange = (val: any) =>
    setSelectedGradingType(val.value);

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

  const handleUploadedFiles = (uploaded: File[]) => setFiles(uploaded);

  const handleChecklistChange = (index: number, value: string) => {
    const updated = [...checklistItems];
    updated[index] = value;
    setChecklistItems(updated);
  };

  const addChecklistItem = () => setChecklistItems([...checklistItems, ""]);
  const removeChecklistItem = (index: number) =>
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  // Final submission handler (ready for API)
  // const handleSubmit = async () => {
  //   const payload = {
  //     title,
  //     description,
  //     domains,
  //     gradingType: selectedGradingType,
  //     gradingTemplate:
  //       selectedGradingType === "numeric"
  //         ? { maxPoints }
  //         : selectedGradingType === "letter"
  //         ? { letterRanges }
  //         : selectedGradingType === "rubric" ||
  //           selectedGradingType === "weightedRubric"
  //         ? { rubricCriteria }
  //         : {},
  //     files,
  //   };
  //   console.log("Payload to API:", payload);
  // };

  const handleGradingCriteriaChange = (
    selected: { value: string | boolean; label: string } | null
  ) => {
    console.log("Selected grading criteria:", selected);
  };

  const handleUploadIdsChange = useCallback((ids: string[]) => {
    setUploadIds((prev) => {
      // only update if different — prevents unnecessary re-renders
      if (JSON.stringify(prev) !== JSON.stringify(ids)) {
        return ids;
      }
      return prev;
    });
  }, []);

  // Compose current criteria for saving as template
  const getCurrentCriteria = () => {
    switch (selectedGradingType) {
      case "numeric":
        return {
          numericCriteria: {
            min: numericCriteria.min || 0,
            max: numericCriteria.max || 100,
          },
        };
      case "letter":
        return {
          letterRanges: letterRanges.filter(
            (r) => r.letter && r.min !== undefined && r.max !== undefined
          ),
        };
      case "rubric":
      case "weightedRubric":
        return {
          rubricCriteria: rubricCriteria.filter(
            (r) => r.label && r.maxPoints !== undefined
          ),
        };
      case "checklist":
        return {
          checklistItems: checklistItems.filter((item) => item.trim() !== ""),
        };
      case "passFail":
        return {};
      default:
        return {};
    }
  };

  // Check if current criteria is valid for saving
  const canSaveTemplate = () => {
    const criteria = getCurrentCriteria();
    switch (selectedGradingType) {
      case "numeric":
        return (
          numericCriteria.min !== undefined &&
          numericCriteria.max !== undefined &&
          numericCriteria.min >= 0 &&
          numericCriteria.max > numericCriteria.min
        );
      case "letter":
        return (
          letterRanges.length > 0 &&
          letterRanges.some(
            (r) => r.letter && r.min !== undefined && r.max !== undefined
          )
        );
      case "rubric":
      case "weightedRubric":
        return (
          rubricCriteria.length > 0 &&
          rubricCriteria.some((r) => r.label && r.maxPoints !== undefined)
        );
      case "checklist":
        return (
          checklistItems.length > 0 &&
          checklistItems.some((item) => item.trim() !== "")
        );
      case "passFail":
        return true;
      default:
        return false;
    }
  };

  // Load template into form
  const handleLoadTemplate = (template: GradingTemplate) => {
    // Map API 'type' to 'gradingType' if needed
    const gradingType = (template as any).type || template.gradingType;

    // Set grading type first
    setSelectedGradingType(gradingType);
    setValue("gradingType", gradingType);

    const criteria = template.criteria;

    // Load criteria based on type
    switch (gradingType) {
      case "numeric":
        if (criteria.numericCriteria) {
          setNumericCriteria({
            min: criteria.numericCriteria.min || 0,
            max: criteria.numericCriteria.max || 100,
          });
        }
        break;
      case "letter":
        if (criteria.letterRanges && criteria.letterRanges.length > 0) {
          setLetterRanges(criteria.letterRanges);
        }
        break;
      case "rubric":
      case "weightedRubric":
        if (criteria.rubricCriteria && criteria.rubricCriteria.length > 0) {
          // Map rubric criteria and ensure minPoints exists
          const mappedRubricCriteria = criteria.rubricCriteria.map(
            (item: any) => ({
              label: item.label || "",
              maxPoints: item.maxPoints || 10,
              minPoints: item.minPoints ?? 0,
              weight: item.weight ?? 0,
            })
          );
          setRubricCriteria(mappedRubricCriteria);
        }
        break;
      case "checklist":
        if (criteria.checklistItems && criteria.checklistItems.length > 0) {
          setChecklistItems(criteria.checklistItems);
        }
        break;
      case "passFail":
        // No criteria needed
        break;
    }

    toast.success(`Template "${template.name}" loaded successfully!`);
  };

  const onSubmit = async (data: PostCreateInput) => {
    // Prevent form submission if template modal is open or saving
    if (
      isSaveTemplateModalOpen ||
      isTemplateLibraryModalOpen ||
      isSavingTemplate
    ) {
      return;
    }

    // Compose gradingTemplate based on selected type
    let gradingTemplate: Record<string, any> = {};

    switch (selectedGradingType) {
      case "numeric":
        gradingTemplate = { numericCriteria };
        break;
      case "letter":
        gradingTemplate = { letterRanges };
        break;
      case "rubric":
      case "weightedRubric":
        gradingTemplate = { rubricCriteria };
        break;
      case "checklist":
        gradingTemplate = { checklistItems };
        break;
      case "passFail":
        gradingTemplate = {};
        break;
    }

    try {
      if (uploadIds.length === 0) toast.error("There is no files uploaded!");
      console.log(uploadIds, "uploadids");
      const postData = {
        ...data,
        grading: {
          criteria: gradingTemplate,
          gradingType: selectedGradingType,
        },
        uploadIds,
        userGrade,
      };
      console.log(postData);
      if (uploadIds.length > 0) {
        await createPostAsync(postData);
        toast.success("Post created successfully!");
        close();
      }
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        // Prevent submission if template modals are open
        if (
          isSaveTemplateModalOpen ||
          isTemplateLibraryModalOpen ||
          isSavingTemplate
        ) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        handleSubmit(onSubmit)(e);
      }}
      className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] max-h-screen overflow-y-scroll scrollbar-hide p-6 sm:p-10 rounded-[27px] flex flex-col"
    >
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className="text-xl text-[#0c0c0c] font-medium">
            Create New Moderate Post
          </p>
          <p className="text-base font-normal text-[#717171]">
            Upload scanned exams, tests, or study materials to share with
            teachers in your subject area.
          </p>
        </div>

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>
      {/* Main Section */}
      <div className="flex flex-col gap-7 mt-10.5 mb-6.5">
        {/* Title */}
        <Input
          label="Title"
          type="text"
          placeholder="Moderate Post Title"
          {...register("title", { required: "Title is required!" })}
          error={errors?.title?.message}
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Post description"
          {...register("description", { required: "Description is required!" })}
          error={errors?.description?.message}
        />
        {/* Tags */}
        <Input
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
        {/* Subject Domains */}
        <div>
          <p className="text-[#0c0c0c] text-base font-normal mb-1">
            Subject Domain
          </p>
          <Controller
            name="domain"
            control={control}
            render={({ field }) => (
              <CustomSelect
                options={optionsSubjectDomains} // array of {value, label}
                onChange={(val) => {
                  console.log(val);
                  field.onChange(val?.value);
                  setDomain(val?.value || "");
                }}
                placeholder="System, Report ..."
              />
            )}
          />
        </div>

        {/* Grading Type */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[#0c0c0c] text-base font-normal">
              Grading Logic Type
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsTemplateLibraryModalOpen(true);
              }}
              className="text-sm px-3 py-1.5 h-auto"
              icon={<FolderOpen size={14} />}
            >
              Load Template
            </Button>
          </div>
          <Controller
            name="gradingType"
            control={control}
            render={({ field }) => {
              const currentOption = gradingTypeOptions.find(
                (opt) => opt.value === selectedGradingType
              );
              return (
                <CustomSelect
                  key={`grading-type-${selectedGradingType}`}
                  options={gradingTypeOptions} // numeric, letter, rubric, checklist, weightedRubric, passFail
                  defaultValue={currentOption || gradingTypeOptions[0]}
                  onChange={(val) => {
                    field.onChange(val?.value);
                    setSelectedGradingType(val?.value || "");
                    setGradingTemplate({}); // reset template when type changes
                  }}
                />
              );
            }}
          />
        </div>

        {/* Dynamic Grading Inputs */}
        {selectedGradingType === "numeric" && (
          <div className="flex gap-4">
            <Input
              key={`numeric-min-${numericCriteria.min}`}
              label="Min Points"
              type="number"
              value={numericCriteria.min ?? ""}
              onChange={(e) =>
                setNumericCriteria((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
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
                  max: Number(e.target.value),
                }))
              }
            />
          </div>
        )}

        {selectedGradingType === "letter" && (
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
                  onChange={(e) =>
                    updateLetterRange(idx, "letter", e.target.value)
                  }
                />
                <Input
                  label="Min"
                  type="number"
                  value={range.min ?? ""}
                  onChange={(e) =>
                    updateLetterRange(idx, "min", Number(e.target.value))
                  }
                />
                <Input
                  label="Max"
                  type="number"
                  value={range.max ?? ""}
                  onChange={(e) =>
                    updateLetterRange(idx, "max", Number(e.target.value))
                  }
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addLetterRange();
              }}
            >
              Add Range
            </Button>
          </div>
        )}

        {(selectedGradingType === "rubric" ||
          selectedGradingType === "weightedRubric") && (
          <div className="flex flex-col gap-2">
            {rubricCriteria.map((item, idx) => (
              <div key={`rubric-${idx}`} className="flex gap-2 items-center">
                <Input
                  label="Label"
                  value={item.label || ""}
                  onChange={(e) => updateRubric(idx, "label", e.target.value)}
                />
                <Input
                  label="Min Points"
                  type="number"
                  value={item.minPoints ?? ""}
                  onChange={(e) =>
                    updateRubric(idx, "minPoints", Number(e.target.value))
                  }
                />
                <Input
                  label="Max Points"
                  type="number"
                  value={item.maxPoints ?? ""}
                  onChange={(e) =>
                    updateRubric(idx, "maxPoints", Number(e.target.value))
                  }
                />
                {selectedGradingType === "weightedRubric" && (
                  <Input
                    label="Weight (%)"
                    type="number"
                    value={item.weight ?? ""}
                    onChange={(e) =>
                      updateRubric(idx, "weight", Number(e.target.value))
                    }
                  />
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addRubricItem();
              }}
            >
              Add Criterion
            </Button>
          </div>
        )}

        {selectedGradingType === "checklist" && (
          <div className="space-y-3">
            <label className="text-[#0c0c0c] text-base font-normal">
              Checklist Items
            </label>
            {checklistItems.map((item, idx) => (
              <div key={`checklist-${idx}`} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder={`Criterion ${idx + 1}`}
                  value={item || ""}
                  onChange={(e) => handleChecklistChange(idx, e.target.value)}
                />
                <Button
                  type="button"
                  variant="red"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeChecklistItem(idx);
                  }}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addChecklistItem();
              }}
            >
              <Plus size={16} className="mr-1" /> Add Item
            </Button>
          </div>
        )}

        {selectedGradingType === "passFail" && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Pass/Fail Criteria
            </p>
            <CustomSelect
              options={[
                { value: "pass", label: "Pass" },
                { value: "fail", label: "Fail" },
              ]}
              defaultValue={{ value: "pass", label: "Pass" }}
              onChange={(val) =>
                setGradingTemplate((prev) => ({
                  ...prev,
                  passFail: val?.value,
                }))
              }
            />
          </div>
        )}

        {/* Save as Template Button */}
        {canSaveTemplate() && (
          <div
            className="flex items-center justify-end pt-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                setIsSaveTemplateModalOpen(true);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              icon={<Bookmark size={16} />}
              className="text-sm"
            >
              Save as Template
            </Button>
          </div>
        )}

        {/* User's Given Grade Section */}
        {selectedGradingType === "numeric" && (
          <Input
            label="Your Grade"
            type="number"
            placeholder="Enter your grade"
            value={userGrade.numeric || ""}
            onChange={(e) =>
              setUserGrade((prev) => ({
                ...prev,
                numeric: Number(e.target.value),
              }))
            }
          />
        )}

        {selectedGradingType === "letter" && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Your Grade (Letter)
            </p>
            <CustomSelect
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
            />
          </div>
        )}

        {(selectedGradingType === "rubric" ||
          selectedGradingType === "weightedRubric") && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">
              Your Grade (Rubric)
            </p>
            {rubricCriteria.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="w-40">{item.label}</span>
                <Input
                  label="Score"
                  type="number"
                  placeholder={`0 - ${item.maxPoints}`}
                  value={userGrade.rubric?.[idx] || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
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

        {selectedGradingType === "checklist" && (
          <div className="space-y-3 w-full">
            <p className="text-sm font-medium text-gray-700">
              Checklist Grades
            </p>
            {checklistItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 w-full">
                <span className="w-40">{item}</span>
                <CustomSelect
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
                />
              </div>
            ))}
          </div>
        )}

        {selectedGradingType === "passFail" && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Your Grade (Pass/Fail)
            </p>
            <CustomSelect
              options={[
                { value: "pass", label: "Pass" },
                { value: "fail", label: "Fail" },
              ]}
              defaultValue={
                userGrade.passFail
                  ? { value: userGrade.passFail, label: userGrade.passFail }
                  : { value: "pass", label: "Pass" }
              }
              onChange={(val) =>
                setUserGrade((prev) => ({
                  ...prev,
                  letter: typeof val?.value === "string" ? val.value : "",
                }))
              }
            />
          </div>
        )}

        {/* File Upload */}
        <FileUploader
          label="Upload Documents"
          onUploadIdsChange={handleUploadIdsChange}
          onLoadingChange={setIsFileBusy}
        />
      </div>

      <div className=" flex justify-center gap-3 items-center w-full ">
        <div className="w-1/3 ">
          <Button className="w-full" variant="secondary" onClick={close}>
            Cancel
          </Button>
        </div>
        <div className="w-2/3">
          {" "}
          {/* Update Button */}
          <Button
            type="submit"
            className={`justify-center text-base w-full transition
    ${
      isCreatingPostLoading || isFileBusy
        ? "opacity-70 cursor-not-allowed"
        : "cursor-pointer"
    }`}
            disabled={isCreatingPostLoading || isFileBusy}
          >
            {isCreatingPostLoading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                  ></path>
                </svg>
                Creating Post...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
        </div>
      </div>

      {/* Save Template Modal */}
      <ResponsiveModal
        isOpen={isSaveTemplateModalOpen}
        onOpenChange={(open) => {
          setIsSaveTemplateModalOpen(open);
          if (!open) {
            // Reset saving state when modal closes
            setTimeout(() => setIsSavingTemplate(false), 100);
          }
        }}
        title="Save Grading Template"
      >
        <SaveTemplateModal
          gradingType={selectedGradingType as GradingTemplateType}
          criteria={getCurrentCriteria()}
          onClose={() => {
            setIsSaveTemplateModalOpen(false);
            setTimeout(() => setIsSavingTemplate(false), 100);
          }}
          onSuccess={() => {
            // Template saved successfully
            setIsSavingTemplate(false);
          }}
          onSavingStart={() => setIsSavingTemplate(true)}
        />
      </ResponsiveModal>

      {/* Template Library Modal */}
      <ResponsiveModal
        isOpen={isTemplateLibraryModalOpen}
        onOpenChange={setIsTemplateLibraryModalOpen}
        title="Grading Templates"
        maxHeight="90vh"
        nested={true}
      >
        <TemplateLibraryModal
          onSelectTemplate={handleLoadTemplate}
          onClose={() => setIsTemplateLibraryModalOpen(false)}
        />
      </ResponsiveModal>
    </form>
  );
}
