import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { AllowedEmailDomainAttributes } from "@/types/typeLog";

export default function DeleteEmailDomainModal({
  EmailDomain,
}: {
  EmailDomain: AllowedEmailDomainAttributes;
}) {
  const { close } = useModal();

  return (
    <div className=" bg-[#FDFDFD] min-w-[551px] p-10 rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className=" text-xl text-[#0c0c0c] font-medium">
            Delete Email Domain
          </p>
          <p className=" text-base font-normal text-[#717171] max-w-[303px]">
            Are you sure to delete `<b>{EmailDomain.emailDomain}</b> `from your platform
          </p>
        </div>

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>

      <div className=" flex justify-center gap-3 items-center w-full mt-12">
        <div className="w-1/3 ">
          <Button className="w-full" variant="secondary" onClick={close}>
            Cancel
          </Button>
        </div>
        <div className="w-2/3">
          {" "}
          <Button className="w-full" variant="red">
            Delete Curricular
          </Button>
        </div>
      </div>
    </div>
  );
}
