"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import { PostAttributes } from "@/types/postAttributes";
import { useState } from "react";

const post = {
  id: "Dd3f32fhfvg3fvb3f",
  name_of_post: "12-Public Speaking Guide",
  posted_by: "Ms. Johnson",
  uploaded_at: "2025-09-15",
  files: [
    "https://arxiv.org/pdf/quant-ph/0410100.pdf", // Dale Carnegie-like public domain text
    "https://arxiv.org/pdf/2111.01147.pdf",
  ],
  post_tags: ["Soft Skills", "Communication"],
  post_status: "archived",
  post_grade_avg: 3.9,
};

export default function PostViewClient() {
  const {
    name_of_post,
    posted_by,
    uploaded_at,
    files,
    post_tags,
    post_grade_avg,
  } = post;

  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const nextFile = () => {
    setCurrentFileIndex((prev) => (prev + 1) % files.length);
  };

  const prevFile = () => {
    setCurrentFileIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  const currentFile = files[currentFileIndex];
  const ext = currentFile.split(".").pop()?.toLowerCase();

  return (
    <div className="bg-[#FDFDFD] py-5.5 px-6 rounded-[40px] grid grid-cols-2 w-full gap-16.5 min-h-screen">
      {/* LEFT SIDE */}
      <div className="flex flex-col items-start rounded-3xl gap-6">
        {/* Top */}
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row gap-3">
            <div className="mt-2 w-2 h-2 rounded-full bg-[#368FFF]"></div>
            <div className="flex flex-col gap-1 items-start">
              <p className="font-medium">{name_of_post}</p>
              <p className="text-sm text-gray-500">
                by {posted_by} • {uploaded_at}
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-1.5 items-center text-[#368FFF] cursor-pointer">
            <UserPlus size={19} />
            <p>Follow</p>
          </div>
        </div>
        {/* full file preview  */}
        <div className="relative bg-gray-100 w-full rounded-3xl flex items-center justify-center overflow-hidden">
          {/* Navigation */}
          <button
            onClick={prevFile}
            className="absolute left-4 bg-white/80 p-2 rounded-full shadow hover:bg-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextFile}
            className="absolute right-4 bg-white/80 p-2 rounded-full shadow hover:bg-white"
          >
            <ChevronRight size={20} />
          </button>

          {/* File content */}
          {ext === "pdf" ? (
            <iframe src={currentFile} className="w-full h-[80vh]" />
          ) : (
            <img src={currentFile} alt="viewer" className="max-h-[80vh]" />
          )}
        </div>
        {/* Bottom tags */}
        <div className="flex flex-row gap-4 items-center">
          {post_tags.map((tag, idx) => (
            <PostTags
              key={idx}
              text={tag}
              type={idx % 2 === 1 ? "colored" : undefined}
            />
          ))}
          <p className="text-sm text-gray-600">Avg: {post_grade_avg}</p>
        </div>
      </div>

      {/* RIGHT SIDE – File Viewer */}
      <div className="bg-red-200">right</div>
    </div>
  );
}

function PostTags({ type, text }: { type?: string; text: string }) {
  return (
    <div
      className={`py-1 px-3 flex flex-row items-center justify-center rounded-[47px] text-sm ${
        type === "colored"
          ? "bg-[#368FFF] text-white"
          : "border border-[#DBDBDB] text-[#717171]"
      }`}
    >
      {text}
    </div>
  );
}
