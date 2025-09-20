"use client";
import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { useState } from "react";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default function CreateNewAnnouncementModal() {
  const { close } = useModal();
  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [expireDate, setExpireDate] = useState<Date | null>(null);

  return (
    <div className=" bg-[#FDFDFD] min-w-[551px] max-h-[95vh] overflow-y-scroll scrollbar-hide p-10 rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className=" text-xl text-[#0c0c0c] font-medium">
            Create New Announcement
          </p>
          <p className=" text-base font-normal text-[#717171]">
            Create a new announcement to be displayed to your users
          </p>
        </div>

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>
      {/* main section */}
      <div className="flex flex-col gap-7 mt-10.5 mb-6.5">
        <Input
          label="Title"
          type="text"
          placeholder="Enter announcement title"
        />
        <Textarea label="Content" placeholder="Type your message here..." />

        <div className="flex flex-row gap-3.5  items-center w-full">
          <div className="flex-1">
            <p className="text-[#0c0c0c] text-base font-normal mb-1">Type</p>
            <CustomMultiSelect
              options={options}
              placeholder="Select Type"
              onChange={handleSelected}
            />
          </div>
          <div className="flex-1">
            <p className="text-[#0c0c0c] text-base font-normal mb-1">
              Priority
            </p>
            <CustomMultiSelect
              options={options}
              placeholder="Select Priority"
              onChange={handleSelected}
            />
          </div>
        </div>
        {/* date */}
        <div className=" flex flex-row gap-3.5 ">
          <div className="flex-1   ">
            <DatePickerInput
              label="Start Date"
              placeholder="Pick a date"
              onChange={setStartDate}
            />
            <p className="mt-4 text-gray-700">
              Selected date: {startDate ? startDate.toDateString() : "None"}
            </p>
          </div>

          <div className="flex-1   ">
            <DatePickerInput
              label="Expire Date"
              placeholder="Pick a date"
              onChange={setExpireDate}
            />
            <p className="mt-4 text-gray-700">
              Selected date: {expireDate ? expireDate.toDateString() : "None"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[#0c0c0c] text-base font-normal mb-1">
            Target Audience
          </p>
          <CustomMultiSelect
            options={options}
            placeholder="Select Curricular Area"
            onChange={handleSelected}
          />
        </div>
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
            Create Announcement
          </Button>
        </div>
      </div>
    </div>
  );
}
