import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { Send, X } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { User } from "@/app/types/user";

export default function MessageUserModal({ user }: { user: User }) {
  const { close } = useModal();
  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };
  return (
    <div className=" bg-[#FDFDFD] min-w-[551px] p-10 rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className=" text-xl text-[#0c0c0c] font-medium">
            Send Support Message
          </p>
          <p className=" text-base font-normal text-[#717171]">
            Send a direct message to <b>{user?.name}</b>
          </p>
        </div>

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>
      {/* main section */}
      <div className="flex flex-col gap-7 mt-10.5 mb-6.5">
        <Input
          label="Subject"
          type="text"
          placeholder="Enter message subject"
        />
        <Textarea label="Message" placeholder="Type your message here" />
      </div>

      <div className=" flex justify-center gap-3 items-center w-full ">
        <div className="w-1/3 ">
          <Button className="w-full" variant="secondary" onClick={close}>
            Cancel
          </Button>
        </div>
        <div className="w-2/3">
          {" "}
          <Button
            className="w-full"
            variant="primary"
            icon={<Send size={20} />}
          >
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}
