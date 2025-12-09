"use client";

import { useState, ChangeEvent, DragEvent, useRef } from "react";
import { UploadCloud, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { useUserRemoveUploadedFile, useUserUploadFile } from "@/hooks/useUser";
import Button from "@/components/ui/Button";
import { extractTextFromFile } from "@/utils/fileTextExtractor";

interface UploadedFile {
  id: string;
  name: string;
  url?: string;
  fileType?: string;
  preview?: string;
  progress?: number;
  originalFile?: File;
}

interface FileUploaderProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onUploadIdsChange?: (ids: string[]) => void;
  onFilesChange?: (files: UploadedFile[]) => void;
  onLoadingChange?: (isLoading: boolean) => void; // 👈 new
}

export default function FileUploader({
  label = "Upload Files",
  accept = ".pdf,image/*",
  multiple = true,
  onUploadIdsChange,
  onFilesChange,
  onLoadingChange,
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const { uploadFileAsync } = useUserUploadFile();
  const { deleteFileAsync } = useUserRemoveUploadedFile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) return;
    onLoadingChange?.(true);
    for (const file of Array.from(selectedFiles)) {
      const fileId = `${file.name}_${file.size}_${file.lastModified}`;
      const previewUrl = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined;

      const tempFile: UploadedFile = {
        id: fileId,
        name: file.name,
        fileType: file.type,
        preview: previewUrl,
        originalFile: file,
      };

      setFiles((prev) => [...prev, tempFile]);
      setUploadingFiles((prev) => new Set(prev).add(fileId));

      try {
        // Extract text content from file (REQUIRED for embedding generation)
        let extractedText = "";
        const isImage = file.type.startsWith("image/");

        if (isImage) {
          // Show toast for OCR processing (can take time)
          const ocrToast = toast.loading(`Processing OCR for ${file.name}...`);

          try {
            extractedText = await extractTextFromFile(file, (progress) => {
              // Update file progress for OCR
              setFiles((prev) =>
                prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
              );
            });

            if (extractedText) {
              toast.success(
                `✅ Extracted ${extractedText.length} characters from ${file.name}`,
                { id: ocrToast }
              );
              console.log(
                `✅ Extracted ${extractedText.length} characters from ${file.name}`
              );
            } else {
              toast.dismiss(ocrToast);
              console.warn(
                `⚠️ No text found in image ${file.name} (may be image-only or low quality)`
              );
            }
            // Reset progress after OCR completes
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId ? { ...f, progress: undefined } : f
              )
            );
          } catch (extractError) {
            toast.error(
              `OCR failed for ${file.name}. Uploading without text extraction.`,
              { id: ocrToast }
            );
            console.warn(
              `⚠️ Failed to extract text from ${file.name}:`,
              extractError
            );
            // Continue with upload even if extraction fails
          }
        } else {
          // For non-images (PDF, text), extract normally
          try {
            extractedText = await extractTextFromFile(file);
            if (extractedText) {
              console.log(
                `✅ Extracted ${extractedText.length} characters from ${file.name}`
              );
            }
          } catch (extractError) {
            console.warn(
              `⚠️ Failed to extract text from ${file.name}:`,
              extractError
            );
            // Continue with upload even if extraction fails
          }
        }

        // Upload file with extracted text content
        const uploadedFile = await uploadFileAsync({
          file,
          textContent: extractedText || undefined,
        });
        const uploaded: UploadedFile = {
          ...tempFile,
          id: uploadedFile.upload.id,
          url: uploadedFile.upload.fileUrl,
        };

        setFiles((prev) => prev.map((f) => (f.id === fileId ? uploaded : f)));
        setUploadingFiles((prev) => {
          const copy = new Set(prev);
          copy.delete(fileId);
          return copy;
        });

        const updatedFiles = files
          .map((f) => (f.id === fileId ? uploaded : f))
          .concat(uploaded);
        onUploadIdsChange?.(updatedFiles.map((f) => f.id));
        onFilesChange?.(updatedFiles);
      } catch (err) {
        console.error(err);
        toast.error(`Failed to upload ${file.name}`);
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        setUploadingFiles((prev) => {
          const copy = new Set(prev);
          copy.delete(fileId);
          return copy;
        });
      } finally {
        onLoadingChange?.(false);
      }
    }
  };

  const deleteFile = async (fileId: string) => {
    onLoadingChange?.(true);

    try {
      await deleteFileAsync(fileId);
      const updated = files.filter((f) => f.id !== fileId);
      setFiles(updated);
      onUploadIdsChange?.(updated.map((f) => f.id));
      onFilesChange?.(updated);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete file");
    } finally {
      onLoadingChange?.(false);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full space-y-3">
      <div className="space-y-2">
        {label && <p className="text-sm font-medium text-gray-900">{label}</p>}
        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFiles(e.target.files)
          }
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept={accept}
          multiple={false}
          capture="environment"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFiles(e.target.files)
          }
          className="hidden"
        />

        {/* Mobile-first primary actions – full width on small screens */}
        <div className="flex flex-col sm:flex-row w-full gap-2 md:hidden">
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full justify-center h-11 sm:h-12 text-sm sm:text-base cursor-pointer transition"
          >
            <UploadCloud className="w-4 h-4 mr-2" />
            Upload file
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => cameraInputRef.current?.click()}
            className="w-full justify-center h-11 sm:h-12 text-sm sm:text-base cursor-pointer transition"
          >
            <Camera className="w-4 h-4 mr-2" />
            Take photo
          </Button>
        </div>

        {/* Desktop drag & drop card (original experience) */}
        <div
          className={`hidden md:flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl py-8 px-6 cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-100 scale-[1.02] shadow-lg"
              : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud
            size={28}
            className={`transition-colors duration-200 ${
              isDragging ? "text-blue-600" : "text-blue-500"
            }`}
          />
          <p
            className={`text-base font-medium transition-colors duration-200 ${
              isDragging ? "text-blue-900" : "text-gray-900"
            }`}
          >
            {isDragging ? "Drop files here" : label}
          </p>
          <p
            className={`text-sm transition-colors duration-200 ${
              isDragging ? "text-blue-700" : "text-gray-500"
            }`}
          >
            {isDragging
              ? "Release to upload"
              : "Drag & drop or click to upload files"}
          </p>
        </div>

        <p className="text-xs sm:text-[13px] text-gray-500 text-center sm:text-left">
          Images or PDFs, up to 20MB. On mobile you can capture a new photo.
        </p>
      </div>

      {/* Uploading indicator */}
      {uploadingFiles.size > 0 && (
        <p className="text-sm text-blue-600 mt-3">
          Uploading {uploadingFiles.size} file(s)...
        </p>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2 text-gray-700">
            Uploaded Files ({files.length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {files.map((file) => {
              const isUploading = uploadingFiles.has(file.id);

              return (
                <div
                  key={file.id}
                  className="relative border rounded-lg overflow-hidden shadow-sm"
                >
                  {file.fileType?.startsWith("image/") ? (
                    <img
                      src={file.preview || file.url}
                      alt={file.name}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">PDF</span>
                    </div>
                  )}

                  {/* Upload Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm">
                      Uploading...
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => deleteFile(file.id)}
                    disabled={isUploading}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                    title="Delete file"
                  >
                    ×
                  </button>

                  {/* File Name */}
                  <div className="p-2 bg-white border-t">
                    <p className="text-xs text-gray-600 truncate">
                      {file.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
