"use client";

import React, { useState } from "react";
import { X, FileText, Image as ImageIcon } from "lucide-react";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
import ImageViewer from "@/components/ui/ImageViewer";
import PdfAnnotationOverlay from "@/components/PdfAnnotationOverlay";

type DocumentViewerProps = {
  fileUrl: string | null | undefined;
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
  uploadId?: string;
  postId?: string;
};

export default function DocumentViewer({
  fileUrl,
  fileName,
  isOpen,
  onClose,
  uploadId,
  postId,
}: DocumentViewerProps) {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  if (!fileUrl) {
    return null;
  }

  // Determine file type from extension
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
    fileExtension
  );
  const isPdf = fileExtension === "pdf";

  // For images, use the existing ImageViewer component
  if (isImage) {
    return (
      <>
        <ResponsiveModal
          isOpen={isOpen}
          onOpenChange={(open) => (!open ? onClose() : null)}
          title=""
          zIndex={150}
          width="w-full sm:w-[90vw] max-w-6xl"
        >
          <div className="relative w-full bg-[#FDFDFD] rounded-[27px] flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-gray-600" />
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileName}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X width={20} height={20} />
              </button>
            </div>

            {/* Image content */}
            <div className="flex-1 min-h-0 p-4 flex items-center justify-center bg-gray-50 rounded-lg">
              <img
                src={fileUrl}
                alt={fileName}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg cursor-pointer"
                onClick={() => {
                  setIsImageViewerOpen(true);
                  onClose();
                }}
              />
            </div>
          </div>
        </ResponsiveModal>

        {/* Full image viewer for zoom/pan */}
        <ImageViewer
          src={isImageViewerOpen ? fileUrl : null}
          isOpen={isImageViewerOpen}
          onClose={() => setIsImageViewerOpen(false)}
          alt={fileName}
        />
      </>
    );
  }

  // For PDFs, use PdfAnnotationOverlay if we have uploadId and postId, otherwise use iframe
  if (isPdf) {
    return (
      <ResponsiveModal
        isOpen={isOpen}
        onOpenChange={(open) => (!open ? onClose() : null)}
        title=""
        zIndex={150}
        width="w-full sm:w-[90vw] max-w-6xl"
        maxHeight="90vh"
      >
        <div className="relative w-full bg-[#FDFDFD] rounded-[27px] flex flex-col h-[90vh] max-h-[90vh]">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-[27px] flex-shrink-0">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <p className="text-sm font-medium text-gray-900 truncate">
                {fileName}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X width={20} height={20} />
            </button>
          </div>

          {/* PDF content */}
          <div className="flex-1 min-h-0 bg-gray-100 rounded-b-[27px] overflow-hidden">
            {uploadId && postId ? (
              <PdfAnnotationOverlay
                postId={postId}
                uploadId={uploadId}
                fileUrl={fileUrl}
                canCreateAnnotations={false}
                variant="desktop"
              />
            ) : (
              <iframe
                src={fileUrl}
                className="w-full h-full border-0"
                title={fileName}
              />
            )}
          </div>
        </div>
      </ResponsiveModal>
    );
  }

  // For other file types, show a simple iframe or download link
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onOpenChange={(open) => (!open ? onClose() : null)}
      title=""
      zIndex={150}
      width="w-full sm:w-[90vw] max-w-6xl"
      maxHeight="90vh"
    >
      <div className="relative w-full bg-[#FDFDFD] rounded-[27px] flex flex-col h-[90vh] max-h-[90vh]">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-[27px] flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <p className="text-sm font-medium text-gray-900 truncate">
              {fileName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X width={20} height={20} />
          </button>
        </div>

        {/* Document content */}
        <div className="flex-1 min-h-0 bg-gray-100 rounded-b-[27px] overflow-hidden p-4">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <FileText className="w-16 h-16 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">
                Preview not available for this file type
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download File
              </a>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
}

