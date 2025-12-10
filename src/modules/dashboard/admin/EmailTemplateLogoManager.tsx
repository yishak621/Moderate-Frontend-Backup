"use client";

import { useState, useEffect, useRef } from "react";
import { UploadCloud, Trash2, Loader, Image as ImageIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  useEmailTemplateLogo,
  useUploadEmailTemplateLogo,
  useDeleteEmailTemplateLogo,
} from "@/hooks/UseAdminRoutes";
import toast from "react-hot-toast";
import SectionHeader from "@/components/SectionHeader";
import { Mail } from "lucide-react";

export default function EmailTemplateLogoManager() {
  const { logoUrl, isLoading, refetch } = useEmailTemplateLogo();
  const {
    uploadLogoAsync,
    isUploading,
    isUploadSuccess,
    isUploadError,
    uploadError,
  } = useUploadEmailTemplateLogo();
  const {
    deleteLogoAsync,
    isDeleting,
    isDeleteSuccess,
    isDeleteError,
    deleteError,
  } = useDeleteEmailTemplateLogo();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle upload success
  useEffect(() => {
    if (isUploadSuccess) {
      toast.success("Logo uploaded successfully!");
      setError(null);
      refetch();
    }
  }, [isUploadSuccess, refetch]);

  // Handle upload error
  useEffect(() => {
    if (isUploadError && uploadError) {
      const errorMessage =
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload logo. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [isUploadError, uploadError]);

  // Handle delete success
  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("Logo deleted successfully!");
      setError(null);
      refetch();
    }
  }, [isDeleteSuccess, refetch]);

  // Handle delete error
  useEffect(() => {
    if (isDeleteError && deleteError) {
      const errorMessage =
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete logo. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [isDeleteError, deleteError]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg =
        "Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP, or SVG).";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = "File size too large. Maximum size is 5MB.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setError(null);
      await uploadLogoAsync(file);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error uploading logo:", err);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete the logo? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setError(null);
      await deleteLogoAsync();
    } catch (err) {
      console.error("Error deleting logo:", err);
    }
  };

  return (
    <div className="flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
      <div className="flex flex-col">
        <SectionHeader
          title="Email Template Logo"
          icon={Mail}
          subheader="Upload and manage the logo that appears in all email templates"
        />

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Current Logo Preview */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-blue-600" size={32} />
            </div>
          ) : logoUrl ? (
            <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Logo
              </label>
              <div className="flex items-center justify-center">
                <img
                  src={logoUrl}
                  alt="Email Template Logo"
                  className="max-w-full h-auto max-h-32 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    setError("Failed to load logo image");
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
              <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-base font-medium">
                No logo uploaded
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Upload a logo to display in email templates
              </p>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {logoUrl ? "Update Logo" : "Upload Logo"}
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            <Button
              type="button"
              icon={<UploadCloud size={20} />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? "Uploading..." : "Choose File"}
            </Button>

            {logoUrl && (
              <Button
                type="button"
                variant="red"
                icon={<Trash2 size={20} />}
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                {isDeleting ? "Deleting..." : "Delete Logo"}
              </Button>
            )}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Supported formats: JPEG, PNG, GIF, WebP, SVG. Max size: 5MB
          </p>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This logo will be used in all email templates
            sent from the platform. Recommended dimensions: 200x60px for best
            results.
          </p>
        </div>
      </div>
    </div>
  );
}

