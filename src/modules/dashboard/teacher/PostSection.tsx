"use client";

import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { PostAttributes } from "@/types/postAttributes";
import PostTags from "./PostTags";
import { timeAgo } from "@/lib/timeAgo";

export default function Post({ post }: { post: PostAttributes }) {
  const router = useRouter();
  if (!post) return null;

  const {
    id,
    title,
    description,
    createdBy,
    createdAt,
    uploads: files,
    // post_tags,
    // post_grade_avg,
  } = post;

  const handleOpen = () => {
    window.open(`/dashboard/teacher/grading/${id}`, "_blank");
  };

  return (
    <div className="flex flex-col items-start border border-[#DBDBDB] p-7 rounded-3xl my-10 gap-4">
      {/* Top */}
      <div className="flex flex-row justify-between items-start  w-full">
        <div className="flex flex-row   gap-3 ">
          <div className="w-2"></div>
          <div className="flex flex-col gap-1 items-start">
            <div className="flex flex-col relative">
              {" "}
              <p className="font-medium">{title}</p>
              <p className="text-sm text-gray-500">
                by {post.author.name} • {timeAgo(createdAt)}
              </p>
              <div className=" absolute top-2 left-[-15px] w-2 h-2 rounded-full bg-[#368FFF]"></div>
            </div>
            <p className=" mt-2.5 block max-w-[40vw] truncate">{description}</p>
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
          const ext = file.fileName.split(".").pop()?.toLowerCase();
          console.log(ext, file.fileName);
          if (ext === "pdf") {
            return (
              <div
                key={idx}
                onClick={handleOpen}
                className="cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col"
              >
                <iframe
                  src={file.fileUrl}
                  className="w-full h-32 pointer-events-none"
                  title="PDF Preview"
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
                onClick={handleOpen}
                className="cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <img
                  src={file.fileUrl}
                  alt="preview"
                  className="w-full h-32 object-cover"
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
              onClick={handleOpen}
              className="cursor-pointer border rounded-xl p-4 text-center text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
            >
              {file.fileName.split("/").pop()}
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="flex flex-row justify-between w-full">
        {/* <div className="flex flex-row gap-4 items-center">
          {post_tags.map((tag, idx) => (
            <PostTags
              key={idx}
              text={tag}
              type={idx % 2 === 1 ? "colored" : undefined}
            />
          ))}
          <p className="text-sm text-gray-600">Avg: {post_grade_avg}</p>
        </div> */}
      </div>
    </div>
  );
}
