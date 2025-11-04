import { useState, useCallback, useRef } from "react";
import { ArrowLeft, Camera, Upload, X, FileText } from "lucide-react";
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
import Image from "next/image";
import toast from "react-hot-toast";

interface MobileCreatePostProps {
  onBack: () => void;
}

export default function MobileCreatePost({ onBack }: MobileCreatePostProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const handleCameraCapture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const capturedFiles = e.target.files;
    if (!capturedFiles || capturedFiles.length === 0) return;

    const file = capturedFiles[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please capture an image");
      return;
    }

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCapturedImages((prev) => [...prev, previewUrl]);

      // Add to files list for upload
      setFiles((prev) => [...prev, file]);

      toast.success("Image captured successfully!");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    }
  };

  const handleRemoveCapturedImage = (index: number) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

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
                  options={optionsSubjectDomains}
                  defaultValue={optionsSubjectDomains.find(
                    (opt: { value: string; label: string }) =>
                      opt.value === field.value
                  )}
                  onChange={(selected) => {
                    field.onChange(selected?.value || "");
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

        {/* File Upload with Camera */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>

          {/* Upload Buttons */}
          <div className="flex gap-3 mb-3">
            {/* Camera Button */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-[24.5px] hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              <Camera className="w-5 h-5" />
              <span className="text-sm font-medium">Take Photo</span>
            </button>

            {/* File Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-[24.5px] hover:bg-gray-50 transition-all"
            >
              <Upload className="w-5 h-5" />
              <span className="text-sm font-medium">Upload File</span>
            </button>
          </div>

          {/* Hidden Camera Input - Opens camera on mobile devices */}
          {/* Note: Requires HTTPS in production. Works on Android/iOS Safari/Chrome */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
            aria-label="Capture photo with camera"
          />

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Captured Images Preview */}
          {capturedImages.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Captured Images:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {capturedImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={imageUrl}
                      alt={`Captured ${index + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg border-2 border-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCapturedImage(index)}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Files List */}
          {files.length > capturedImages.length && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Other Files:
              </p>
              {files.slice(capturedImages.length).map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate max-w-[200px]">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFiles(
                        files.filter(
                          (_, i) => i !== index + capturedImages.length
                        )
                      )
                    }
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X size={16} />
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
