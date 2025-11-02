"use client";

import {
  User as UserIcon,
  Settings,
  Users,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { useState, useRef } from "react";

import SectionHeader from "@/components/SectionHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  useUpdateUserData,
  useUserData,
  useUploadProfilePicture,
  useDeleteProfilePicture,
} from "@/hooks/useUser";
import { useForm } from "react-hook-form";
import { User } from "@/app/types/user";
import toast from "react-hot-toast";
import DeleteAccountModal from "@/modules/dashboard/shared/modals/DeleteAccountModal";
import UserAvatar from "@/components/UserAvatar";

export default function AdminProfileClient() {
  const { user, isLoading, isSuccess, isError } = useUserData();
  const {
    editUser,
    editUserAsync,
    isEditingUserLoading,
    isEditingUserSuccess,
    isEditingUserError,
  } = useUpdateUserData();

  const { uploadProfilePictureAsync, isUploadingProfilePictureLoading } =
    useUploadProfilePicture();

  const { deleteProfilePictureAsync, isDeletingProfilePictureLoading } =
    useDeleteProfilePicture();

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle profile picture upload
  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      await uploadProfilePictureAsync(file);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // Handle profile picture delete
  const handleDeleteProfilePicture = async () => {
    if (!user?.profilePictureUrl) return;

    if (
      !window.confirm("Are you sure you want to delete your profile picture?")
    ) {
      return;
    }

    try {
      await deleteProfilePictureAsync();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  if (!user) return null;
  return (
    <div className="flex flex-col gap-5">
      {/* Profile Picture Section */}
      <div className="flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
        <SectionHeader
          title="Profile Picture"
          icon={Camera}
          subheader="Update your profile picture"
        />
        <div className="mt-6 flex flex-col items-center gap-4">
          <UserAvatar
            profilePictureUrl={user?.profilePictureUrl || ""}
            name={user?.name}
            size="lg"
            showDeleteButton={!!user?.profilePictureUrl}
            onDelete={handleDeleteProfilePicture}
            isDeleting={isDeletingProfilePictureLoading}
          />
          <div className="flex flex-col items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingProfilePictureLoading}
              className="justify-center text-base cursor-pointer transition"
            >
              {isUploadingProfilePictureLoading ? (
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
                  Uploading...
                </>
              ) : user?.profilePictureUrl ? (
                "Change Picture"
              ) : (
                "Upload Picture"
              )}
            </Button>
            <p className="text-xs text-gray-500">
              Recommended: Square image, max 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Top Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]"
      >
        <div className="flex flex-col">
          <SectionHeader
            title="Profile"
            icon={UserIcon}
            subheader="View and update your admin information"
          />
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Your Name"
              label="Name"
              {...register("name")}
              defaultValue={user?.name}
            />
            <Input
              type="email"
              placeholder="Your Email"
              label="Email"
              {...register("email")}
              defaultValue={user?.email}
            />
          </div>
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

      {/* Admin Stats Section */}
      <div className="flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
        <div className="flex flex-col">
          <SectionHeader
            title="Admin Overview"
            icon={Users}
            subheader="System-wide administrator statistics"
          />
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between bg-[#F7F7F7] rounded-[20px] px-6 py-5 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#EDEDED] flex items-center justify-center rounded-full">
                <Users className="w-6 h-6 text-[#0c0c0c]" />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#0c0c0c]">
                  Total Admins
                </p>
                <p className="text-sm text-gray-500">
                  Currently active in the system
                </p>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0c0c0c]">23</p>
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD] border-2 border-red-100">
        <SectionHeader
          title="Delete Account"
          icon={AlertTriangle}
          subheader="Permanently delete your account"
        />
        <div className="mt-6 flex flex-col gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-red-800">
                  Warning: This action cannot be undone
                </p>
                <p className="text-xs text-red-700">
                  Deleting your account will permanently remove all your data,
                  including posts, grades, comments, and profile information.
                </p>
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="red"
            onClick={() => setIsDeleteAccountModalOpen(true)}
            className="justify-center mt-2 text-base cursor-pointer w-full sm:w-auto self-start"
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteAccountModalOpen}
        onOpenChange={setIsDeleteAccountModalOpen}
      >
        <Modal.Content>
          <DeleteAccountModal />
        </Modal.Content>
      </Modal>
    </div>
  );
}
