"use client";
import { useModal } from "@/components/ui/Modal";
import { useResponsiveModal } from "@/hooks/useResponsiveModal";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { Announcement } from "@/app/types/announcement";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAdminAnnouncementDeleteData } from "@/hooks/UseAdminRoutes";
import { PostAttributes, PostCreateInput } from "@/types/postAttributes";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import { useSendMessageAPI } from "@/hooks/useMessage";
import { Message } from "@/app/types/threads";
import { useRouter } from "next/navigation";

export default function ComposeNewMessageModal({
  post,
}: {
  post: PostAttributes;
}) {
  const { close } = useResponsiveModal();
  const router = useRouter();

  //HOOKS

  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
    setValue,
  } = useForm<Message>();

  const {
    sendMessageAPI,
    sendMessageAPIAsync,
    isSendMessageAPILoading,
    isSendMessageAPISuccess,
    isSendMessageAPIError,
  } = useSendMessageAPI();

  const onSubmit = async (data: Message) => {
    const dataToBeSent = { ...data, receiverId: post?.author.id };
    sendMessageAPIAsync(dataToBeSent);
  };

  useEffect(() => {
    if (isSendMessageAPISuccess && !isSendMessageAPILoading) {
      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 768px)").matches;
      const url = `/dashboard/teacher/messages?chatId=${post?.author.id}`;

      close(); // Close modal first

      // Small delay to allow modal to close smoothly
      setTimeout(() => {
        if (isDesktop) {
          window.open(url, "_blank");
        } else {
          router.push(url);
        }
      }, 100);
    }
  }, [
    isSendMessageAPISuccess,
    isSendMessageAPILoading,
    post?.author.id,
    close,
    router,
  ]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] p-6 sm:p-10 rounded-[27px] flex flex-col"
    >
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className=" text-xl text-[#0c0c0c] font-medium">
            Compose New Message
          </p>
          <p className=" text-base font-normal text-[#717171] max-w-[315px]">
            Create a new chat with <b>{post?.author.name}</b>
          </p>
        </div>

        <div className="hidden sm:block" onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col gap-7 mt-10.5 mb-6.5">
        {/* Title
        <Input
          label="Receiver user name"
          type="text"
          placeholder="User name"
          value={post?.author.name}
        /> */}

        {/* Description */}
        <Textarea
          label="Message"
          placeholder="Your Message"
          {...register("content", { required: "Message is required!" })}
          error={errors?.content?.message}
        />
      </div>

      <div className=" flex justify-center gap-3 items-center w-full ">
        <div className="w-1/3 ">
          <Button className="w-full" variant="secondary" onClick={close}>
            Cancel
          </Button>
        </div>
        <div className="w-2/3">
          {/* Update Button */}
          <Button
            type="submit"
            className={`justify-center text-base w-full transition
    ${
      isSendMessageAPILoading
        ? "opacity-70 cursor-not-allowed"
        : "cursor-pointer"
    }`}
            disabled={isSendMessageAPILoading}
          >
            {isSendMessageAPILoading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                  ></path>
                </svg>
                Sending Message...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
