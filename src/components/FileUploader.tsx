"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

interface FileUploaderProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
}

export default function FileUploader({
  label = "Upload files",
  accept = "image/*",
  multiple = true,
  onUpload,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const fileArray = Array.from(newFiles);
    setFiles((prev) => [...prev, ...fileArray]);
    onUpload(fileArray);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#DBDBDB] rounded-2xl py-8 px-6 cursor-pointer transition hover:border-[#368FFF] hover:bg-[#F8FAFF]"
      >
        <UploadCloud size={28} className="text-[#368FFF]" />
        <p className="text-[#0C0C0C] text-base font-medium">{label}</p>
        <p className="text-[#717171] text-sm">Drag & drop or click to upload</p>
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

      {/* Preview Section */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center border rounded-xl p-2 bg-[#FDFDFD] shadow-sm"
            >
              {file.type.startsWith("image/") ? (
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={100}
                  height={100}
                  className="object-cover rounded-lg w-full h-24"
                />
              ) : (
                <p className="text-sm text-[#0C0C0C] truncate w-full text-center">
                  {file.name}
                </p>
              )}
              <button
                onClick={() => handleRemove(idx)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white border shadow hover:bg-[#f5f5f5]"
              >
                <X size={14} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
