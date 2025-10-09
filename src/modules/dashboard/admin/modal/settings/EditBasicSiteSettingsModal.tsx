"use client";
import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import Button from "@/components/ui/Button";
import { Curricular } from "@/app/types/curricular";
import {
  useAdminCurricularAreaEditData,
  useAdminUpdateSiteSetting,
} from "@/hooks/UseAdminRoutes";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ToggleSetting from "../../ToggleSetting";
import { useState } from "react";
import { Setting } from "@/types/admin.type";
import Textarea from "@/components/ui/Textarea";

export default function EditBasicSiteSettingsModal({
  BasicSetting,
}: {
  BasicSetting: Setting;
}) {
  const { close } = useModal();
  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };
  const [status, setStatus] = useState("active");
  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
  } = useForm<Setting>();

  const {
    editSiteSetting,
    editSiteSettingAsync,
    isEditingSiteSettingError,
    isEditingSiteSettingLoading,
    isEditingSiteSettingSuccess,
  } = useAdminUpdateSiteSetting(BasicSetting?.key);

  if (!BasicSetting) return null;

  const onSubmit = async (data: Setting) => {
    const dataToBeSent = Array.isArray(data.value) ? data.value : [data.value];
    try {
      await editSiteSettingAsync(dataToBeSent);

      toast.success("Setting updated successfully!");
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
      className=" bg-[#FDFDFD] min-w-[551px] p-10 rounded-[27px] flex flex-col"
    >
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className=" text-xl text-[#0c0c0c] font-medium">Update Setting</p>
          <p className=" text-base font-normal text-[#717171]">
            Edit a {`${BasicSetting.key}`}
          </p>
        </div>

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>
      {/* main section */}
      <div className="flex flex-col gap-7 mt-10.5 mb-6.5">
        {/* <Input
          label="Enter Value"
          type="text"
          placeholder={BasicSetting.value[0]}
          defaultValue={BasicSetting.value[0]}
          {...register("value")}
        /> */}
        <Input
          label="Key"
          type="text"
          placeholder="Enter setting key eg. Meta-tag"
          defaultValue={BasicSetting.key}
          {...register("key", {
            required: "Title is required!",
          })}
          error={errors?.key?.message}
        />
        <Input
          label="Value"
          placeholder="Type your setting value here..."
          defaultValue={BasicSetting.value[0]}
          {...register("value", {
            required: "Value is required!",
          })}
          error={errors?.value?.message}
        />
        <Input
          label="Category"
          placeholder="Category of setting eg. System , Users , Apperance ... "
          defaultValue={BasicSetting.category}
          {...register("category", {
            required: "Category is required!",
          })}
          error={errors?.category?.message}
        />
        <Textarea
          label="Description"
          placeholder="Description of setting "
          defaultValue={BasicSetting.description}
          {...register("description")}
          error={errors?.description?.message}
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
            className={`justify-center text-base cursor-pointer w-full transition
        ${isEditingSiteSettingLoading && "opacity-70 cursor-not-allowed"}`}
            disabled={isEditingSiteSettingLoading}
          >
            {isEditingSiteSettingLoading ? (
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
              "Update"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
