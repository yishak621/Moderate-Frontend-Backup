"use client";
import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import Button from "@/components/ui/Button";
import { Curricular } from "@/app/types/curricular";
import {
  useAdminCurricularAreaEditData,
  useAdminUpdatePlan,
  useAdminUpdateSiteSetting,
} from "@/hooks/UseAdminRoutes";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ToggleSetting from "../../ToggleSetting";
import { useState } from "react";
import { Plan, Setting } from "@/types/admin.type";
import Textarea from "@/components/ui/Textarea";
import CustomSelect from "@/components/ui/CustomSelect";

export default function EditPlanModal({ Plan }: { Plan: Plan }) {
  const { close } = useModal();
  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };

  const popularOptions = [
    { value: true, label: "True" },
    { value: false, label: "False" },
  ];
  const [status, setStatus] = useState("active");
  const [featuresInput, setFeaturesInput] = useState(
    Plan.features?.join(", ") || ""
  );
  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
  } = useForm<Plan>();

  const {
    editPlan,
    editPlanAsync,
    isEditingPlanError,
    isEditingPlanLoading,
    isEditingPlanSuccess,
  } = useAdminUpdatePlan(Plan.stripePriceId ?? "");

  if (!Plan) return null;

  const onSubmit = async (data: Plan) => {
    // parse feature string to array
    const featuresArr = featuresInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    const finalData = {
      ...data,
      features: featuresArr,
    };
    try {
      await editPlanAsync(finalData);
      toast.success("Plan updated successfully!");
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
          <p className=" text-xl text-[#0c0c0c] font-medium">Update Setting</p>
          <p className=" text-base font-normal text-[#717171]">
            Edit a <b>{`${Plan.name}`}</b> plan
          </p>
        </div>

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>
      {/* main section */}
      <div className="flex flex-col gap-7 mt-10.5 mb-6.5">
        <Input
          label="Name"
          type="text"
          placeholder="Enter Name of plan"
          defaultValue={Plan.name}
          {...register("name", {
            required: "Name is required!",
          })}
          error={errors?.name?.message}
        />
        <Input
          label="Price"
          placeholder="Type your setting value here..."
          defaultValue={Plan.price}
          {...register("price", {
            required: "price is required!",
          })}
          error={errors?.price?.message}
        />
        <Input
          label="Currency"
          placeholder="Type your setting value here..."
          defaultValue={Plan.currency}
          {...register("currency", {
            required: "currency is required!",
          })}
          error={errors?.currency?.message}
        />
        <Input
          label="Interval"
          placeholder="Type your setting value here..."
          defaultValue={Plan.interval}
          {...register("interval", {
            required: "interval is required!",
          })}
          error={errors?.interval?.message}
        />
        <div className="flex-1">
          <p className="text-[#0c0c0c] text-base font-normal mb-1">isActive</p>

          <Controller
            name="isActive"
            control={control}
            defaultValue={Plan.isActive}
            render={({ field }) => (
              <CustomSelect
                options={popularOptions}
                defaultValue={popularOptions.find(
                  (option) => option.value === Plan.isActive
                )}
                placeholder="Select isActive"
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="flex-1">
          <p className="text-[#0c0c0c] text-base font-normal mb-1">isPopular</p>

          <Controller
            name="isPopular"
            control={control}
            defaultValue={Plan.isPopular}
            render={({ field }) => (
              <CustomSelect
                options={popularOptions}
                defaultValue={popularOptions.find(
                  (option) => option.value === Plan.isPopular
                )}
                placeholder="Select isActive"
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <Input
          label="Features (comma separated)"
          placeholder="feature 1, feature 2, more features..."
          value={featuresInput}
          onChange={(e) => setFeaturesInput(e.target.value)}
          className="mt-4"
          // not using {...register()} because we parse string to array manually
        />

        <Textarea
          label="Description"
          placeholder="Description of setting "
          defaultValue={Plan.description}
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
        ${isEditingPlanLoading && "opacity-70 cursor-not-allowed"}`}
            disabled={isEditingPlanLoading}
          >
            {isEditingPlanLoading ? (
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
              "Update Plan"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
