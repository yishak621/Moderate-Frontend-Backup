"use client";

import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { Trash, Plus, X } from "lucide-react";
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

export default function EditPostModal({ post }: { post: PostAttributes }) {
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
  const [numericCriteria, setNumericCriteria] = useState([{}]);
  const [letterRanges, setLetterRanges] = useState([
    { letter: "A", min: 90, max: 100 },
  ]);
  const [rubricCriteria, setRubricCriteria] = useState([
    { label: "Criterion 1", maxPoints: 10, weight: 0 },
  ]);
  const [checklistItems, setChecklistItems] = useState<string[]>([""]);
  const [passFailCriteria, setPassFailCriteria] = useState<string | boolean>(
    "pass"
  );

  const [files, setFiles] = useState<File[]>([]);

  const { close } = useModal();
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

  const onSubmit = async (data: PostCreateInput) => {
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
      onSubmit={handleSubmit(onSubmit)}
      className=" bg-[#FDFDFD] min-w-[551px] max-h-screen overflow-y-scroll scrollbar-hide p-10 rounded-[27px] flex flex-col"
    >
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className="text-xl text-[#0c0c0c] font-medium">
            Edit Your Moderate Post
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
          placeholder="Chemistry midterm exam"
          defaultValue={post?.title}
          {...register("title", { required: "Title is required!" })}
          error={errors?.title?.message}
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Post description"
          defaultValue={post?.description}
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
          <p className="text-[#0c0c0c] text-base font-normal mb-1">
            Grading Logic Type
          </p>
          <Controller
            name="gradingType"
            control={control}
            render={({ field }) => (
              <CustomSelect
                options={gradingTypeOptions} // numeric, letter, rubric, checklist, weightedRubric, passFail
                defaultValue={gradingTypeOptions[0]}
                onChange={(val) => {
                  field.onChange(val?.value);
                  setSelectedGradingType(val?.value || "");
                  setGradingTemplate({}); // reset template when type changes
                }}
              />
            )}
          />
        </div>

        {/* Dynamic Grading Inputs */}
        {selectedGradingType === "numeric" && (
          <div className="flex gap-4">
            <Input
              label="Min Points"
              type="number"
              defaultValue={gradingTemplate.min || ""}
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
              defaultValue={gradingTemplate.max || ""}
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
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  label="Letter"
                  type="text"
                  defaultValue={range.letter}
                  onChange={(e) =>
                    updateLetterRange(idx, "letter", e.target.value)
                  }
                />
                <Input
                  label="Min"
                  type="number"
                  defaultValue={range.min}
                  onChange={(e) =>
                    updateLetterRange(idx, "min", Number(e.target.value))
                  }
                />
                <Input
                  label="Max"
                  type="number"
                  defaultValue={range.max}
                  onChange={(e) =>
                    updateLetterRange(idx, "max", Number(e.target.value))
                  }
                />
              </div>
            ))}
            <Button type="button" onClick={addLetterRange}>
              Add Range
            </Button>
          </div>
        )}

        {(selectedGradingType === "rubric" ||
          selectedGradingType === "weightedRubric") && (
          <div className="flex flex-col gap-2">
            {rubricCriteria.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  label="Label"
                  defaultValue={item.label}
                  onChange={(e) => updateRubric(idx, "label", e.target.value)}
                />
                <Input
                  label="Min Points"
                  type="number"
                  defaultValue={item.maxPoints}
                  onChange={(e) =>
                    updateRubric(idx, "minPoints", Number(e.target.value))
                  }
                />
                <Input
                  label="Max Points"
                  type="number"
                  defaultValue={item.maxPoints}
                  onChange={(e) =>
                    updateRubric(idx, "maxPoints", Number(e.target.value))
                  }
                />
                {selectedGradingType === "weightedRubric" && (
                  <Input
                    label="Weight (%)"
                    type="number"
                    defaultValue={item.weight}
                    onChange={(e) =>
                      updateRubric(idx, "weight", Number(e.target.value))
                    }
                  />
                )}
              </div>
            ))}
            <Button type="button" onClick={addRubricItem}>
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
              <div key={idx} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder={`Criterion ${idx + 1}`}
                  defaultValue={item}
                  onChange={(e) => handleChecklistChange(idx, e.target.value)}
                />
                <Button
                  type="button"
                  variant="red"
                  onClick={() => removeChecklistItem(idx)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addChecklistItem}>
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
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Checklist Grades
            </p>
            {checklistItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
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
                Updating Post...
              </>
            ) : (
              "Update Post"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
