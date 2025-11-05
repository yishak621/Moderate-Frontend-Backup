"use client";
import { useModal } from "@/components/ui/Modal";
import { useResponsiveModal } from "@/hooks/useResponsiveModal";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { Announcement } from "@/app/types/announcement";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAdminAnnouncementDeleteData } from "@/hooks/UseAdminRoutes";
import { PostAttributes } from "@/types/postAttributes";

export default function ViewStatPostModal({ post }: { post: PostAttributes }) {
  //   const {
  //     deleteAnnouncement,
  //     deleteAnnouncementAsync,
  //     data,
  //     isDeletingAnnouncementLoading,
  //     isDeletingAnnouncementSuccess,
  //     isDeletingAnnouncementError,
  //     deletingAnnouncementError,
  //   } = useAdminAnnouncementDeleteData(announcement?.id ?? "");
  const { close } = useResponsiveModal();

  return (
    <div className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] p-6 sm:p-10 rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className=" text-xl text-[#0c0c0c] font-medium">
            View Moderation Post Stat
          </p>
          <p className=" text-base font-normal text-[#717171] max-w-[315px]">
            Al Stat about the post soon
          </p>
        </div>

        <div className="hidden sm:block" onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
