"use client";

import { useState, ChangeEvent, DragEvent } from "react";
import { UploadCloud, Trash } from "lucide-react";
import { useUserRemoveUploadedFile, useUserUploadFile } from "@/hooks/useUser";

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
  const { uploadFileAsync } = useUserUploadFile();
  const { deleteFileAsync } = useUserRemoveUploadedFile();

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
        const uploadedFile = await uploadFileAsync(file);
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
        alert(`Failed to upload ${file.name}`);
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
      alert("Failed to delete file");
    } finally {
      onLoadingChange?.(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      {/* Upload Box */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-2xl py-8 px-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
      >
        <UploadCloud size={28} className="text-blue-500" />
        <p className="text-base font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">
          Drag & drop or click to upload files
        </p>

        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFiles(e.target.files)
          }
          className="hidden"
          id="fileInput"
        />

        <label
          htmlFor="fileInput"
          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-700 transition"
        >
          Choose File
        </label>
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
