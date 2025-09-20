import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default function AddTeacherModal() {
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
          <p className=" text-xl text-[#0c0c0c] font-medium">Add New Teacher</p>
          <p className=" text-base font-normal text-[#717171]">
            Create a new teacher account for your platform
          </p>
        </div>

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000]" />
        </div>
      </div>
      {/* main section */}
      <div className="flex flex-col gap-7 mt-10.5">
        <Input label="Email" type="email" placeholder="you@example.com" />
        <Input label="Email" type="email" placeholder="you@example.com" />
        <div>
          <p className="text-[#0c0c0c] text-base font-normal mb-1">
            Subject Domains
          </p>
          <CustomMultiSelect
            options={options}
            defaultValue={[options[0], options[1]]}
            onChange={handleSelected}
          />
        </div>
      </div>
    </div>
  );
}
