"use client";

import { useState, ChangeEvent, DragEvent, useEffect } from "react";
import { UploadCloud, Trash } from "lucide-react";
import { useUserRemoveUploadedFile, useUserUploadFile } from "@/hooks/useUser";
import toast from "react-hot-toast";

interface UploadedFile {
  id: string;
  url?: string;
  name: string;
  progress?: number; // upload progress %
}

interface FileUploaderProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onUploadIdsChange?: (ids: string[]) => void;
  onFilesChange?: (files: UploadedFile[]) => void;
}

export default function FileUploader({
  label = "Upload Files",
  accept,
  multiple,
  onUploadIdsChange,
  onFilesChange,
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const { uploadFileAsync, isUploadingFileLoading, isUploadingFileSuccess } =
    useUserUploadFile();
  const { deleteFileAsync, isDeletingFileSuccess, isDeletingFileLoading } =
    useUserRemoveUploadedFile();

  const handleFiles = async (selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) return;

    const uploaded: UploadedFile[] = [];

    for (const file of Array.from(selectedFiles)) {
      const tempFile: UploadedFile = {
        id: `temp-${file.name}-${Date.now()}`,
        name: file.name,
        // url: URL.createObjectURL(file),
      };

      setFiles((prev) => [...prev, tempFile]);

      try {
        const uploadedFile = await uploadFileAsync(file);
        const realFile: UploadedFile = {
          id: uploadedFile.upload.id,
          name: file.name,
          url: uploadedFile.upload.fileUrl,
        };

        uploaded.push(realFile);

        setFiles((prev) =>
          prev.map((f) => (f.id === tempFile.id ? realFile : f))
        );

        // ✅ Call the parent callback after each successful upload
        const currentFiles = files
          .map((f) => (f.id === tempFile.id ? realFile : f))
          .concat(
            uploaded.filter((f) => !files.some((old) => old.id === f.id))
          );
        onUploadIdsChange?.(currentFiles.map((f) => f.id));
        onFilesChange?.(currentFiles);
      } catch (err) {
        console.error(err);
        alert(`Failed to upload ${file.name}`);
        setFiles((prev) => prev.filter((f) => f.id !== tempFile.id));
      }
    }
  };

  const removeFile = async (fileId: string) => {
    try {
      await deleteFileAsync(fileId);
      const updated = files.filter((f) => f.id !== fileId);
      setFiles(updated);
      onUploadIdsChange?.(updated.map((f) => f.id));
      onFilesChange?.(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to delete file");
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl py-8 px-6 cursor-pointer transition-all ${
          isDragging
            ? "border-[#368FFF] bg-[#F8FAFF] shadow-md scale-[1.02]"
            : "border-[#DBDBDB] hover:border-[#368FFF] hover:bg-[#F8FAFF]"
        }`}
      >
        <UploadCloud
          size={28}
          className={`${
            isDragging ? "text-[#2573d2]" : "text-[#368FFF]"
          } transition-colors`}
        />
        <p className="text-[#0C0C0C] text-base font-medium">{label}</p>
        <p className="text-[#717171] text-sm">
          {isDragging
            ? "Drop files to upload..."
            : "Drag & drop or click to upload"}
        </p>

        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          id="fileInput"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFiles(e.target.files)
          }
        />

        <label
          htmlFor="fileInput"
          className="mt-2 px-4 py-2 bg-[#368FFF] text-white text-sm rounded-lg cursor-pointer hover:bg-[#2573d2] transition"
        >
          Choose File
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-[#F7F9FC] p-3 rounded-lg relative"
            >
              <div className="flex items-center gap-3">
                {file.url && (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <p className="text-sm text-[#0C0C0C]">{file.name}</p>
              </div>

              <button
                onClick={() => removeFile(file.id)}
                className="p-2 text-red-500 hover:text-red-700 transition"
              >
                <Trash size={16} />
              </button>

              {file.progress !== undefined && file.progress < 100 && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300 rounded-b">
                  <div
                    className="h-full bg-blue-600 rounded-b transition-all"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
