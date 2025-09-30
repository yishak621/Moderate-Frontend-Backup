import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import FileUploader from "@/components/FileUploader";
import { CustomSelect } from "@/components/ui/CustomSelect";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default function CreatPostModal() {
  const { close } = useModal();
  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };

  const handleGradingCriteriaChange = (
    selected: { value: string; label: string } | null
  ) => {
    console.log("Selected grading criteria:", selected);
  };
  return (
    <div className=" bg-[#FDFDFD] min-w-[551px] max-h-screen overflow-y-scroll scrollbar-hide p-10 rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className="text-xl text-[#0c0c0c] font-medium">Create New Post</p>
          <p className="text-base font-normal text-[#717171]">
            Share updates, announcements, or resources with your community.
          </p>
        </div>

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>
      {/* main section */}
      <div className="flex flex-col gap-7 mt-10.5 mb-6.5">
        <Input label="Title" type="text" placeholder="Chemistry midterm exam" />
        <Textarea label="Description" placeholder="Post description" />
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
        <div>
          <p className="text-[#0c0c0c] text-base font-normal mb-1">
            Grading Criteria
          </p>
          <CustomSelect
            options={options}
            defaultValue={options[0]}
            onChange={handleGradingCriteriaChange}
          />
        </div>
        <FileUploader
          label="Upload Test images or documents"
          accept="image/*,.pdf,.docx"
          multiple
          onUpload={(files) => console.log("Uploaded:", files)}
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
            Create Post
          </Button>
        </div>
      </div>
    </div>
  );
}
