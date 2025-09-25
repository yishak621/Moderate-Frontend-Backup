"use client";

import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { PostAttributes } from "@/types/postAttributes";

export default function Post({ post }: { post: PostAttributes }) {
  const {
    id,
    name_of_post,
    posted_by,
    uploaded_at,
    files,
    post_tags,
    post_grade_avg,
  } = post;

  const router = useRouter();

  const handleOpen = () => {
    window.open(`/dashboard/teacher/grading/${id}`, "_blank");
  };

  return (
    <div className="flex flex-col items-start border border-[#DBDBDB] p-7 rounded-3xl my-10 gap-4">
      {/* Top */}
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row gap-3 ">
          <div className="mt-4 w-2 h-2 rounded-full bg-[#368FFF]"></div>
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

      {/* File previews */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
        {files.map((file, idx) => {
          const ext = file.split(".").pop()?.toLowerCase();

          if (ext === "pdf") {
            return (
              <div
                key={idx}
                onClick={handleOpen}
                className="cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col"
              >
                <iframe
                  src={file}
                  className="w-full h-32 pointer-events-none"
                  title="PDF Preview"
                />
                <p className="p-2 text-xs truncate">{file.split("/").pop()}</p>
              </div>
            );
          }

          if (["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
            return (
              <div
                key={idx}
                onClick={handleOpen}
                className="cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <img
                  src={file}
                  alt="preview"
                  className="w-full h-32 object-cover"
                />
                <p className="p-2 text-xs truncate">{file.split("/").pop()}</p>
              </div>
            );
          }

          return (
            <div
              key={idx}
              onClick={handleOpen}
              className="cursor-pointer border rounded-xl p-4 text-center text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
            >
              {file.split("/").pop()}
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="flex flex-row justify-between w-full">
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
