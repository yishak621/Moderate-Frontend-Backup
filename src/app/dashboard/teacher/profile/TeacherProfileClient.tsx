"use client";

import { User as UserIcon, Settings, Users } from "lucide-react";

import SectionHeader from "@/components/SectionHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  useUpdateUserData,
  useUpdatePassword,
  useUserData,
} from "@/hooks/useUser";
import { useForm } from "react-hook-form";
import { User } from "@/app/types/user";
import toast from "react-hot-toast";

export default function TeacheProfileClient() {
  const { user, isLoading, isSuccess, isError } = useUserData();
  const {
    editUser,
    editUserAsync,
    isEditingUserLoading,
    isEditingUserSuccess,
    isEditingUserError,
  } = useUpdateUserData();

  const { updatePasswordAsync, isUpdatingPasswordLoading } =
    useUpdatePassword();

  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
  } = useForm<User>();

  const onSubmit = async (data: User) => {
    const { confirmPassword, ...payload } = data;
    try {
      await editUserAsync(payload);

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

  if (!user) return null;

  // Submit handler for personal info
  const onSubmitPersonalInfo = async (data: User) => {
    const { name, email } = data;
    try {
      await editUserAsync({ name, email });
      toast.success("Personal information updated successfully");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // Submit handler for password
  const onSubmitPassword = async (data: User) => {
    const { password } = data;
    if (!password) return;
    try {
      await updatePasswordAsync({ password });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Personal Information Section */}
      <form
        onSubmit={handleSubmit(onSubmitPersonalInfo)}
        className="flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD] mb-5"
      >
        <div className="flex flex-col">
          <SectionHeader
            title="Personal Information"
            icon={UserIcon}
            subheader="Update your name and email"
          />
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Your Name"
              label="Name"
              {...register("name")}
              defaultValue={user.name}
            />
            <Input
              type="email"
              placeholder="Your Email"
              label="Email"
              {...register("email")}
              defaultValue={user.email}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className={`justify-center mt-2.5 sm:mt-4 text-base cursor-pointer  transition 
        ${
          isEditingUserLoading
            ? "opacity-70 cursor-not-allowed"
            : "hover:bg-blue-700"
        }`}
            >
              {isEditingUserLoading ? (
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
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Password Section */}
      <form
        onSubmit={handleSubmit(onSubmitPassword)}
        className="flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]"
      >
        <div className="flex flex-col">
          <SectionHeader
            title="Change Password"
            icon={Settings}
            subheader="Update your password"
          />
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <Input
              type="password"
              placeholder="New Password"
              label="Password"
              error={errors?.password?.message}
              {...register("password")}
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              label="Confirm New Password"
              error={errors?.confirmPassword?.message}
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className={`justify-center mt-2.5 sm:mt-4 text-base cursor-pointer  transition 
        ${
          isUpdatingPasswordLoading
            ? "opacity-70 cursor-not-allowed"
            : "hover:bg-blue-700"
        }`}
            >
              {isUpdatingPasswordLoading ? (
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
                "Update Password"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
