"use client";

import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { useSubjectDomains } from "@/hooks/usePublicRoutes";
import { Announcement } from "@/app/types/announcement";
import toast from "react-hot-toast";
import { useAdminAnnouncementEditData } from "@/hooks/UseAdminRoutes";
import { Controller, useForm } from "react-hook-form";
import { CustomSelect } from "@/components/ui/CustomSelect";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { SubjectDomain } from "@/types/typeLog";

const typeOptions = [
  { value: "Announcement", label: "Announcement" },
  { value: "Newsletter", label: "Newsletter" },
  { value: "System Alert", label: "System Alert" },
  { value: "Marketing", label: "Marketing" },
  { value: "Report", label: "Report" },
  { value: "General", label: "General" },
  { value: "Feature", label: "Feature" },
];

const priorityOptions = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];
export default function EditAnnouncementModal({
  announcement,
}: {
  announcement: Announcement;
}) {
  const { close } = useModal();
  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };

  //react hook form
  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
    setValue,
  } = useForm<Announcement>();

  //HOOKS
  const {
    subjectDomains,
    isLoading: issubjectDomainsLoading,
    isSuccess: issubjectDomainsSuccess,
    isError: issubjectDomainsError,
    error,
  } = useSubjectDomains();

  const optionsSubjectDomains = subjectDomains?.map((item: SubjectDomain) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const {
    editAnnouncement,
    editAnnouncementAsync,
    isEditingAnnouncementLoading,
    isEditingAnnouncementSuccess,
    isEditingAnnouncementError,
  } = useAdminAnnouncementEditData(announcement?.id ?? "");

  if (!announcement) return null;

  const onSubmit = async (data: Announcement) => {
    try {
      console.log(data);
      await editAnnouncementAsync(data);
      toast.success("Announcement updated successfully!");
      close();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        toast.error(err.message);
      } else {
        console.error("Unknown error", err);
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" bg-[#FDFDFD] min-w-[551px] p-10 rounded-[27px] flex flex-col max-h-screen overflow-y-scroll scrollbar-hide"
    >
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className=" text-xl text-[#0c0c0c] font-medium">
            Edit Announcement
          </p>
          <p className=" text-base font-normal text-[#717171]">
            Update the announcement details
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
          defaultValue={announcement?.title}
          {...register("title", {
            required: "Title is required!",
          })}
          error={errors?.title?.message}
        />
        <Textarea
          label="Content"
          placeholder="Type your announcement content here..."
          defaultValue={announcement?.content}
          {...register("content", {
            required: "Content is required!",
          })}
          error={errors?.title?.message}
        />

        <div className="flex flex-row gap-3.5  items-center w-full">
          <div className="flex-1">
            <p className="text-[#0c0c0c] text-base font-normal mb-1">Type</p>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <CustomMultiSelect
                  options={typeOptions}
                  defaultValue={
                    announcement?.type?.map((t) => ({ value: t, label: t })) ||
                    []
                  }
                  onChange={field.onChange}
                  placeholder="System , Report .."
                />
              )}
            />
          </div>
          <div className="flex-1">
            <p className="text-[#0c0c0c] text-base font-normal mb-1">
              Priority
            </p>

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={priorityOptions}
                  defaultValue={{
                    label: announcement?.priority || "",
                    value: announcement?.priority || "",
                  }}
                  placeholder="Select Priority"
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
        {/* Dates */}
        <div className="flex flex-row gap-3.5 mt-4">
          <div className="flex-1">
            <Controller
              name="startDate"
              control={control}
              defaultValue={announcement?.startDate}
              render={({ field }) => (
                <DatePickerInput
                  label="Start Date"
                  placeholder="Pick a date"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <p className="mt-4 text-gray-700">
              Start date: {watch("startDate")?.toString() ?? "None"}
            </p>
          </div>

          <div className="flex-1">
            <Controller
              name="expireDate"
              control={control}
              defaultValue={announcement?.expireDate}
              render={({ field }) => (
                <DatePickerInput
                  label="Expire Date"
                  placeholder="Pick a date"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <p className="mt-4 text-gray-700">
              Selected date: {watch("expireDate")?.toString() ?? "None"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[#0c0c0c] text-base font-normal mb-1">
            Target Audience
          </p>

          <Controller
            name="domainIDs"
            control={control}
            render={({ field }) => (
              <CustomMultiSelect
                options={optionsSubjectDomains}
                defaultValue={
                  announcement?.domains?.map((t) => ({
                    value: t.id,
                    label: t.name,
                  })) || []
                }
                placeholder="Select Curricular Area"
                onChange={field.onChange}
              />
            )}
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
          {/* Update Button */}
          <Button
            type="submit"
            className={`justify-center text-base cursor-pointer w-full transition 
        ${isEditingAnnouncementLoading && "opacity-70 cursor-not-allowed"}`}
            disabled={isEditingAnnouncementLoading}
          >
            {isEditingAnnouncementLoading ? (
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
                Updating...
              </>
            ) : (
              "Update Announcement"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
