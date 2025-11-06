"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { ensureHttps } from "@/lib/urlHelpers";
import Image from "next/image";

interface File {
  fileUrl: string;
  fileName: string;
}

interface MobileFileSwiperProps {
  files: File[];
  onPostOpen: () => void;
}

export default function MobileFileSwiper({
  files,
  onPostOpen,
}: MobileFileSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth;
      const scrollPosition = index * cardWidth;

      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
    setCurrentIndex(index);
  };

  const nextFile = () => {
    const nextIndex = (currentIndex + 1) % files.length;
    scrollToIndex(nextIndex);
  };

  const prevFile = () => {
    const prevIndex = currentIndex === 0 ? files.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };

  // Handle scroll events to update current index
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.offsetWidth;
      const index = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(index);
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Files Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {files.map((file, idx) => {
          const ext = file.fileName.split(".").pop()?.toLowerCase();

          if (ext === "pdf") {
            return (
              <div
                key={idx}
                onClick={onPostOpen}
                className="flex-shrink-0 w-full snap-start cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col"
              >
                <iframe
                  src={`${ensureHttps(file.fileUrl)}#toolbar=0`}
                  className="w-full h-40 pointer-events-none"
                  title="PDF Preview"
                  loading="lazy"
                  allow="fullscreen"
                />
                <p className="p-2 text-xs truncate">
                  {file.fileName.split("/").pop()}
                </p>
              </div>
            );
          }

          if (["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
            return (
              <div
                key={idx}
                onClick={onPostOpen}
                className="flex-shrink-0 w-full snap-start cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <Image
                  width={100}
                  height={100}
                  src={file.fileUrl}
                  alt="preview"
                  loading="lazy"
                  className="w-full h-40 object-cover"
                />
                <p className="p-2 text-xs truncate">
                  {file.fileName.split("/").pop()}
                </p>
              </div>
            );
          }

          return (
            <div
              key={idx}
              onClick={onPostOpen}
              className="flex-shrink-0 w-full snap-start cursor-pointer border rounded-xl p-4 text-center text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
            >
              {file.fileName.split("/").pop()}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {files.length > 1 && (
        <>
          <button
            onClick={prevFile}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-all"
            aria-label="Previous file"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          <button
            onClick={nextFile}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-all"
            aria-label="Next file"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {files.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {files.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-blue-500 w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to file ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
