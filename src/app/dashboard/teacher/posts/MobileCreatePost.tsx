import { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import MobileInput from "@/components/ui/MobileInput";
import MobileButton from "@/components/ui/MobileButton";
import MobileCustomSelect from "@/components/ui/MobileCustomSelect";
import MobileTextarea from "@/components/ui/MobileTextarea";
import { useSubjectDomains } from "@/hooks/usePublicRoutes";
import { SubjectDomain } from "@/types/typeLog";
import {
  useUserCreatePost,
  useUserData,
  useUserRemoveUploadedFile,
  useUserUploadFile,
} from "@/hooks/useUser";
import { useForm, Controller } from "react-hook-form";
import { PostCreateInput } from "@/types/postAttributes";

interface MobileCreatePostProps {
  onBack: () => void;
}

export default function MobileCreatePost({ onBack }: MobileCreatePostProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { subjectDomains } = useSubjectDomains();
  const { user } = useUserData();
  const { createPostAsync } = useUserCreatePost("all");
  const { uploadFileAsync } = useUserUploadFile();
  const { deleteFileAsync } = useUserRemoveUploadedFile();

  const optionsSubjectDomains =
    subjectDomains?.map((domain: SubjectDomain) => ({
      value: domain.id,
      label: domain.name,
    })) || [];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      subjectDomainId: "",
      tags: [] as string[],
    },
  });

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await uploadFileAsync(file);
        setUploadedFiles((prev) => [...prev, response.data.fileUrl]);
        return response.data.fileUrl;
      } catch (error) {
        console.error("File upload failed:", error);
        throw error;
      }
    },
    [uploadFileAsync]
  );

  const handleFileRemove = useCallback(
    async (fileUrl: string) => {
      try {
        await deleteFileAsync(fileUrl);
        setUploadedFiles((prev) => prev.filter((url) => url !== fileUrl));
      } catch (error) {
        console.error("File removal failed:", error);
      }
    },
    [deleteFileAsync]
  );

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Upload files first
      const fileUrls = await Promise.all(
        files.map((file) => handleFileUpload(file))
      );

      const postData: PostCreateInput = {
        title: data.title,
        description: data.description,
        domain: data.subjectDomainId,
        gradingType: "numeric",
        gradingTemplate: {},
        postCreatorGrade: {},
        uploadIds: [...uploadedFiles, ...fileUrls],
        tags: data.tags,
      };

      await createPostAsync(postData);

      // Reset form and go back
      reset();
      setFiles([]);
      setUploadedFiles([]);
      onBack();
    } catch (error) {
      console.error("Post creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Mobile Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-lg bg-white shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Create New Post</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <MobileInput
                {...field}
                label="Post Title"
                placeholder="Enter post title"
                error={errors.title?.message}
              />
            )}
          />
        </div>

        {/* Description */}
        <div>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <MobileTextarea
                {...field}
                label="Description"
                placeholder="Describe your post..."
                rows={4}
                error={errors.description?.message}
              />
            )}
          />
        </div>

        {/* Subject Domain */}
        <div>
          <Controller
            name="subjectDomainId"
            control={control}
            rules={{ required: "Subject domain is required" }}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Domain
                </label>
                <MobileCustomSelect
                  options={optionsSubjectDomains.map(
                    (option: { value: string; label: string }) => option.label
                  )}
                  value={
                    optionsSubjectDomains.find(
                      (opt: { value: string; label: string }) =>
                        opt.value === field.value
                    )?.label || ""
                  }
                  onChange={(selectedLabel) => {
                    const selectedOption = optionsSubjectDomains.find(
                      (opt: { value: string; label: string }) =>
                        opt.label === selectedLabel
                    );
                    field.onChange(selectedOption?.value || "");
                  }}
                  placeholder="Select subject domain"
                />
                {errors.subjectDomainId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subjectDomainId.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Tags */}
        <div>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <MobileInput
                {...field}
                label="Tags (Optional)"
                placeholder="Add tags separated by commas"
                onChange={(e) => {
                  const tags = e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag);
                  field.onChange(tags);
                }}
              />
            )}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setFiles(Array.from(e.target.files));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {files.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Selected files:</p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm text-gray-700"
                >
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </MobileButton>
        </div>
      </form>
    </div>
  );
}
