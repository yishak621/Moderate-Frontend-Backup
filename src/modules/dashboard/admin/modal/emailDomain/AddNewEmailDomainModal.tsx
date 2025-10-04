import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import Button from "@/components/ui/Button";
import { useAdminEmailDomainCreateData } from "@/hooks/UseAdminRoutes";
import { useForm } from "react-hook-form";
import { AllowedEmailDomainAttributes } from "@/types/typeLog";
import toast from "react-hot-toast";

export default function AddNewEmailDomainModal() {
  const { close } = useModal();

  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
  } = useForm<AllowedEmailDomainAttributes>();

  const {
    createEmailDomain,
    createEmailDomainAsync,
    data,
    isCreatingEmailDomainLoading,
    isCreatingEmailDomainSuccess,
    isCreatingEmailDomainError,
    creatingCurricularAreaError,
  } = useAdminEmailDomainCreateData();

  const onSubmit = async (data: AllowedEmailDomainAttributes) => {
    try {
      await createEmailDomainAsync(data);

      toast.success("Email Domain data created successfully");
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
            Add Allowed Email Domain
          </p>
          <p className=" text-base font-normal text-[#717171]">
            Add a new school email domain to allow teacher registrations
          </p>
        </div>

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>
      {/* main section */}
      <div className="flex flex-col gap-7 mt-10.5 mb-6.5">
        <Input
          label="School Name *"
          type="text"
          placeholder="Full School Name"
          {...register("name", {
            required: "Name is required!",
          })}
          error={errors?.name?.message}
        />
        <Input
          label="Catagory *"
          type="text"
          placeholder="Schools - Community Schools"
          {...register("category", {
            required: "Category is required!",
          })}
          error={errors?.category?.message}
        />
        <Input
          label="Email Domain *"
          type="text"
          placeholder="e.g. archi.edu.uk "
          {...register("emailDomain", {
            required: "Email Domain is required!",
          })}
          error={errors?.emailDomain?.message}
        />

        <Input
          label="Website"
          type="text"
          placeholder="Zareyakob Elementary School"
          {...register("website")}
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
        ${isCreatingEmailDomainLoading && "opacity-70 cursor-not-allowed"}`}
            disabled={isCreatingEmailDomainLoading}
          >
            {isCreatingEmailDomainLoading ? (
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
                Creating...
              </>
            ) : (
              "Create Email Domain"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
