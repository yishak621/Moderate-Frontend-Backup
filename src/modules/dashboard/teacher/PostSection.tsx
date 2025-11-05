"use client";

import { useRouter } from "next/navigation";
import {
  MessageSquare,
  MessagesSquare,
  MoreVertical,
  UserPlus,
  Flag,
} from "lucide-react";
import { PostAttributes } from "@/types/postAttributes";
import PostTags from "./PostTags";
import { timeAgo } from "@/lib/timeAgo";
import { decoded } from "@/lib/currentUser";
import { useState } from "react";
import PopupCard from "@/components/PopCard";
import PostActionsList from "./post/PostActionsList";
import AddNewCurricularAreaModal from "../admin/modal/curricular/AddNewCurricularAreaModal";
import Modal from "@/components/ui/Modal";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
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
    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches;
    const url = `/dashboard/teacher/messages?chatId=${author?.id}`;
    if (isDesktop) {
      window.open(url, "_blank");
    } else {
      router.push(url);
    }
  };
  const handlePostOpen = () => {
    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches;
    const url = `/dashboard/teacher/grading/${id}`;
    if (isDesktop) {
      window.open(url, "_blank");
    } else {
      router.push(url);
    }
  };

  return (
    <div className=" flex flex-col items-start bg-[#FDFDFD] border border-[#DBDBDB] mb-[17px] p-4 sm:p-7 rounded-2xl sm:rounded-3xl gap-3 sm:gap-4 w-full max-w-full overflow-hidden">
      {/* Top */}
      <div className="flex flex-row justify-between items-start w-full gap-2 sm:gap-0">
        <div className="flex flex-row gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-1 sm:w-2 flex-shrink-0"></div>
          <div className="flex flex-col gap-1 items-start min-w-0 flex-1">
            <div className="flex flex-col relative w-full">
              <p className="font-medium text-sm text-[#0C0C0C] sm:text-base truncate w-full">
                {title}
              </p>
              <p className="text-[13px] font-normal sm:text-sm text-gray-500 truncate w-full">
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
          <>
            {/* Desktop: Follow & Message Icons */}
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Follow Button */}
              <div className="flex flex-row gap-1 sm:gap-1.5 items-center text-[#717171] cursor-pointer hover:opacity-80">
                <UserPlus
                  size={16}
                  className="sm:w-[19px] sm:h-[19px] text-[#717171]"
                />
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
                <MessagesSquare
                  size={16}
                  className="text-[#717171] cursor-pointer hover:opacity-80 sm:w-[19px] sm:h-[19px]"
                />
              </div>
            </div>

            {/* Mobile: 3-Dot Menu */}
            <div className="sm:hidden relative">
              <button
                onClick={() => setIsPopUpOpen((v) => !v)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>
              <PopupCard
                isOpen={isPopUpOpen}
                onClose={() => setIsPopUpOpen(false)}
                align="right"
              >
                <div className="flex flex-col">
                  <button
                    onClick={() => {
                      setIsPopUpOpen(false);
                      // TODO: Handle follow
                    }}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <UserPlus size={18} />
                    <span>Follow</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPopUpOpen(false);
                      if (didUserChatWithMe) {
                        handleOpen();
                      } else {
                        handleOpenModal(ComposeNewMessageModal, { post });
                      }
                    }}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <MessagesSquare size={18} />
                    <span>
                      Message {post.author?.name?.split(" ")[0] || "User"}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPopUpOpen(false);
                      // TODO: Handle report flag user
                    }}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Flag size={18} />
                    <span>Report Flag User</span>
                  </button>
                </div>
              </PopupCard>
            </div>

            <ResponsiveModal isOpen={open} onOpenChange={setOpen}>
              {ModalComponent && <ModalComponent {...modalProps} />}
            </ResponsiveModal>
          </>
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

            <ResponsiveModal isOpen={open} onOpenChange={setOpen}>
              {ModalComponent && <ModalComponent {...modalProps} />}
            </ResponsiveModal>
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
                  src={`${file.fileUrl}#toolbar=0`}
                  className="w-full h-32 xl:h-64 pointer-events-none"
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
