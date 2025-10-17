"use client";

import { useRouter } from "next/navigation";
import { MoreVertical, UserPlus } from "lucide-react";
import { PostAttributes } from "@/types/postAttributes";
import PostTags from "./PostTags";
import { timeAgo } from "@/lib/timeAgo";
import { decoded } from "@/lib/currentUser";
import { useState } from "react";
import PopupCard from "@/components/PopCard";
import PostActionsList from "./post/PostActionsList";
import AddNewCurricularAreaModal from "../admin/modal/curricular/AddNewCurricularAreaModal";
import Modal from "@/components/ui/Modal";
import CreatPostModal from "./post/CreatPostModal";
import EditPostModal from "./post/EditPostModal";
import DeletePostModal from "./post/DeletePostModal";
import ViewStatPostModal from "./post/ViewDetailPostModal";

export default function Post({ post }: { post: PostAttributes }) {
  const router = useRouter();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});

  const handleOpenModal = <P,>(
    component: React.ComponentType<P>,
    props?: P
  ) => {
    setModalComponent(() => component);
    setModalProps(props || {});
    setOpen(true);
  };

  if (!post) return null;

  const {
    id,
    title,
    description,
    createdBy,
    createdAt,
    uploads: files,
    tags: post_tags,
    post_grade_avg,
  } = post;
  const currentUserId = decoded?.id;

  const handleActionSelect = (action: string) => {
    setIsPopUpOpen(false);
    switch (action) {
      case "edit":
        handleOpenModal(EditPostModal, { post });
        break;
      case "delete":
        handleOpenModal(DeletePostModal, { post });
        break;
      case "stats":
        handleOpenModal(ViewStatPostModal, { post });
        break;
      default:
        console.log("Selected:", action);
    }
  };

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
        {currentUserId !== createdBy ? (
          <div className="flex flex-row gap-1.5 items-center text-[#368FFF] cursor-pointer">
            <UserPlus size={19} />
            <p>Follow</p>
          </div>
        ) : (
          <div className="relative" onClick={() => setIsPopUpOpen((v) => !v)}>
            <MoreVertical
              size={20}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            />

            <PopupCard
              isOpen={isPopUpOpen}
              onClose={() => setIsPopUpOpen(false)}
              align="right"
            >
              <PostActionsList onSelect={handleActionSelect} />
            </PopupCard>

            <Modal isOpen={open} onOpenChange={setOpen}>
              <Modal.Content>
                {ModalComponent && <ModalComponent {...modalProps} />}
              </Modal.Content>
            </Modal>
          </div>
        )}
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
                  className="w-full h-32 xl:h-64 pointer-events-none"
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
                  className="w-full h-32 xl:h-64 object-cover"
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
