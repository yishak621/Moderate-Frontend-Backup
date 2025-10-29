"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, MoreVertical, UserPlus } from "lucide-react";
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
import ComposeNewMessageModal from "./messages/ComposeNewMessageModal";
import { useThreads } from "@/hooks/useMessage";
import { Thread, Threads } from "@/app/types/threads";
import MobileFileSwiper from "./MobileFileSwiper";

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

  const currentUserId = decoded?.id ?? "";
  // HOOKS
  const { isThreadsLoading, isThreadsSuccess, threads } =
    useThreads(currentUserId);

  if (!post) return null;

  const {
    id,
    author,
    title,
    description,
    createdBy,
    createdAt,
    uploads: files,
    tags: post_tags,
    post_grade_avg,
  } = post;

  const didUserChatWithMe = threads?.data.some((thread: Threads) =>
    thread.messages.some(
      (msg) => msg.senderId === author?.id || msg.receiverId === author?.id
    )
  );

  console.log(author?.name, didUserChatWithMe);
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
    window.open(`/dashboard/teacher/messages?chatId=${author?.id}`, "_blank");
  };
  const handlePostOpen = () => {
    window.open(`/dashboard/teacher/grading/${id}`, "_blank");
  };

  return (
    <div className="flex flex-col items-start border border-[#DBDBDB] p-4 sm:p-7 rounded-2xl sm:rounded-3xl gap-3 sm:gap-4 w-full max-w-full overflow-hidden">
      {/* Top */}
      <div className="flex flex-row justify-between items-start w-full gap-2 sm:gap-0">
        <div className="flex flex-row gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-1 sm:w-2 flex-shrink-0"></div>
          <div className="flex flex-col gap-1 items-start min-w-0 flex-1">
            <div className="flex flex-col relative w-full">
              <p className="font-medium text-sm sm:text-base truncate w-full">
                {title}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 truncate w-full">
                by {post.author.name} • {timeAgo(createdAt)}
              </p>
              <div className="absolute top-2 left-[-12px] sm:left-[-15px] w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#368FFF] flex-shrink-0"></div>
            </div>
            <p className="mt-2 sm:mt-2.5 block max-w-full sm:max-w-[40vw] text-xs sm:text-sm line-clamp-2">
              {description}
            </p>
          </div>
        </div>
        {currentUserId !== createdBy ? (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Follow Button */}
            <div className="flex flex-row gap-1 sm:gap-1.5 items-center text-[#368FFF] cursor-pointer hover:opacity-80">
              <UserPlus size={16} className="sm:w-[19px] sm:h-[19px]" />
              <p className="text-xs sm:text-sm hidden sm:block">Follow</p>
            </div>

            {/* Message Icon */}
            <div
              onClick={
                didUserChatWithMe
                  ? handleOpen
                  : () => handleOpenModal(ComposeNewMessageModal, { post })
              }
            >
              <MessageSquare
                size={16}
                className="text-[#368FFF] cursor-pointer hover:opacity-80 sm:w-[19px] sm:h-[19px]"
              />
            </div>
            <Modal isOpen={open} onOpenChange={setOpen}>
              <Modal.Content>
                {ModalComponent && <ModalComponent {...modalProps} />}
              </Modal.Content>
            </Modal>
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
      <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
        {files.map((file, idx) => {
          const ext = file.fileName.split(".").pop()?.toLowerCase();
          console.log(ext, file.fileName);
          if (ext === "pdf") {
            return (
              <div
                key={idx}
                onClick={handlePostOpen}
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
                onClick={handlePostOpen}
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

      {/* Mobile File Swiper */}
      {files.length > 0 && (
        <div className="md:hidden w-full">
          <MobileFileSwiper files={files} onPostOpen={handlePostOpen} />
        </div>
      )}

      {/* Bottom */}
      <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0">
        <div className="flex flex-row gap-2 items-center flex-wrap min-w-0">
          {post_tags.map((tag, idx) => (
            <PostTags
              key={idx}
              text={tag}
              type={idx % 2 === 1 ? "colored" : undefined}
            />
          ))}
          <p className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
            Avg: {post_grade_avg}
          </p>
        </div>
      </div>
    </div>
  );
}
