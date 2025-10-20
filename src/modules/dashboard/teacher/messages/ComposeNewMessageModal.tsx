"use client";
import { useModal } from "@/components/ui/Modal";
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

interface SendFirstMessageInputs {
  receiverId: string;
  message: string;
}

export default function ComposeNewMessageModal({
  post,
}: {
  post: PostAttributes;
}) {
  const { close } = useModal();

  //HOOKS

  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
    setValue,
  } = useForm<SendFirstMessageInputs>();

  return (
    <div className=" bg-[#FDFDFD] min-w-[551px] p-10 rounded-[27px] flex flex-col">
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

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col gap-7 mt-10.5 mb-6.5">
        {/* Title */}
        <Input
          label="Receiver user name"
          type="text"
          placeholder="User name"
          value={post?.author.name}
        />

        {/* Description */}
        <Textarea
          label="Message"
          placeholder="Your Message"
          {...register("message", { required: "Message is required!" })}
          error={errors?.message?.message}
        />
      </div>

      <div className=" flex justify-center gap-3 items-center w-full ">
        <div className="w-1/3 ">
          <Button className="w-full" variant="secondary" onClick={close}>
            Cancel
          </Button>
        </div>
        <div className="w-2/3">
          {" "}
          <Button className="w-full" variant="primary">
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}
