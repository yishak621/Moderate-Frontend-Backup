import Input from "@/components/ui/Input";
import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { SignupFormDataTypes } from "@/types/authData.type";
import { Controller, useForm } from "react-hook-form";
import { useSubjectDomains } from "@/hooks/usePublicRoutes";
import { SubjectDomain } from "@/types/typeLog";
import toast from "react-hot-toast";
import { useAdminUserCreateData } from "@/hooks/UseAdminRoutes";
import { useEffect, useState } from "react";
import CustomSelect from "@/components/ui/CustomSelect";
const roleOptions = [
  { value: "TEACHER", label: "Teacher" },
  // { value: "admin", label: "Admin" },
  { value: "SYSTEM_ADMIN", label: "System Admin" },
];

export default function AddTeacherModal() {
  const router = useRouter();

  const [role, setRole] = useState<string>("TEACHER");

  const {
    createNewUserData,
    createNewUserDataAsync,
    isCreatingNewUserDataLoading,
    isCreatingNewUserDataSuccess,
    isCreatingNewUserDataError,
    creatingNewUserDataError,
  } = useAdminUserCreateData();
  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<SignupFormDataTypes>();
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

  const { close } = useModal();

  const onSubmit = async (data: SignupFormDataTypes) => {
    console.log(data);
    try {
      // Await the login mutation
      const res = await createNewUserDataAsync(data);

      if (isCreatingNewUserDataSuccess) {
        toast.success("Teacher created successfully!");
      }
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

  useEffect(() => {
    if (isCreatingNewUserDataSuccess) {
      toast.success("Teacher created successfully!");
      close();
    }
  }, [isCreatingNewUserDataSuccess, close]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" bg-[#FDFDFD] min-w-[551px] p-10 rounded-[27px] flex flex-col max-h-screen overflow-y-scroll scrollbar-hide"
    >
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className=" text-xl text-[#0c0c0c] font-medium">Add New Teacher</p>
          <p className=" text-base font-normal text-[#717171]">
            Create a new teacher account for your platform
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
          placeholder="Enter user name"
          error={errors?.name?.message}
          {...register("name", { required: "Name is required" })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="user@school.edu.uk"
          error={errors?.email?.message}
          {...register("email", { required: "Email is required" })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="*********"
          error={errors?.password?.message}
          {...register("password", { required: "Password is required" })}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="*********"
          error={errors?.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
        />
        <div>
          <p className="text-[#0c0c0c] text-base font-normal mb-1">Role</p>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <CustomSelect
                options={roleOptions}
                onChange={(selected: any) => {
                  field.onChange(selected?.value);
                  setRole(
                    typeof selected?.value === "string" ? selected.value : ""
                  );
                }}
                placeholder="Select user role..."
              />
            )}
          />
        </div>
        {role === "TEACHER" && (
          <div>
            <p className="text-[#0c0c0c] text-base font-normal mb-1">
              Curricular Areas
            </p>
            <Controller
              name="subjectDomains"
              control={control}
              render={({ field }) => (
                <CustomMultiSelect
                  options={optionsSubjectDomains}
                  onChange={field.onChange}
                  placeholder="Search and select subjects..."
                />
              )}
            />
          </div>
        )}
      </div>

      <div className=" flex justify-center gap-3 items-center w-full ">
        <div className="w-1/3 ">
          <Button className="w-full" variant="secondary" onClick={close}>
            Cancel
          </Button>
        </div>
        <div className="w-2/3">
          {/* Button */}
          <Button
            type="submit"
            className={`justify-center  text-base cursor-pointer w-full transition 
        ${isCreatingNewUserDataLoading && "opacity-70 cursor-not-allowed"}`}
          >
            {isCreatingNewUserDataLoading ? (
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
                Creating user...
              </>
            ) : (
              "Create User"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
