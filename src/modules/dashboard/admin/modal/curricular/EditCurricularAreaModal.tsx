"use client";
import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import Button from "@/components/ui/Button";
import { Curricular } from "@/app/types/curricular";
import { useAdminCurricularAreaEditData } from "@/hooks/UseAdminRoutes";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ToggleSetting from "../../ToggleSetting";
import { useState } from "react";

export default function EditCurricularAreaModal({
  Curricular,
}: {
  Curricular: Curricular;
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
  } = useForm<Curricular>();

  const {
    editCurricularArea,
    editCurricularAreaAsync,
    isEditingCurricularAreaLoading,
    isEditingCurricularAreaSuccess,
    isEditingCurricularAreaError,
    editingCurricularAreaError,
  } = useAdminCurricularAreaEditData(Curricular?.id);

  if (!Curricular) return null;

  const onSubmit = async (data: Curricular) => {
    try {
      await editCurricularAreaAsync(data);

      toast.success("User updated successfully");
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
          <p className=" text-xl text-[#0c0c0c] font-medium">
            Update Curricular Area Data
          </p>
          <p className=" text-base font-normal text-[#717171]">
            Edit a {`${Curricular.name}`} curricular area
          </p>
        </div>

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>
      {/* main section */}
      <div className="flex flex-col gap-7 mt-10.5 mb-6.5">
        <Input
          label="Currcular Area Name"
          type="text"
          placeholder={Curricular.name}
          defaultValue={Curricular.name}
          {...register("name")}
        />
        <Controller
          name="status"
          control={control}
          defaultValue={Curricular?.status ?? "inactive"} // must match type
          render={({ field }) => (
            <ToggleSetting
              title="Status"
              description="Control curricular area status"
              value={field.value === "active"} // convert to boolean for toggle
              onChange={(val) => field.onChange(val ? "active" : "inactive")} // map back
            />
          )}
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
        ${isEditingCurricularAreaLoading && "opacity-70 cursor-not-allowed"}`}
            disabled={isEditingCurricularAreaLoading}
          >
            {isEditingCurricularAreaLoading ? (
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
