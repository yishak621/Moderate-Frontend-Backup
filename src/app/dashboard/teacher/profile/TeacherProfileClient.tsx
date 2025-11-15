"use client";

import {
  Settings,
  Users,
  Camera,
  AlertTriangle,
  User2Icon,
  ArrowLeft,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import SectionHeader from "@/components/SectionHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import BottomSheet from "@/components/ui/BottomSheet";
import {
  useUpdateUserData,
  useUpdatePassword,
  useUserData,
  useUploadProfilePicture,
  useDeleteProfilePicture,
  useGetFollowers,
  useGetFollowingUsers,
} from "@/hooks/useUser";
import { useForm } from "react-hook-form";
import { User } from "@/app/types/user";
import toast from "react-hot-toast";
import DeleteAccountModal from "@/modules/dashboard/shared/modals/DeleteAccountModal";
import UserAvatar from "@/components/UserAvatar";

export default function TeacheProfileClient() {
  const router = useRouter();
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

  const { uploadProfilePictureAsync, isUploadingProfilePictureLoading } =
    useUploadProfilePicture();

  const { deleteProfilePictureAsync, isDeletingProfilePictureLoading } =
    useDeleteProfilePicture();

  const { followers, isFollowersLoading } = useGetFollowers();
  const { followingUsers, isFollowingUsersLoading } = useGetFollowingUsers();

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // detect mobile for bottom sheet
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
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

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Mobile Back Button */}
      <div className="md:hidden -mt-2  mb-2 sticky top-0 z-20 ">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
      </div>
      {/* Profile Picture Section */}
      <div className="flex flex-col py-4 px-4 sm:py-6 sm:px-6 rounded-2xl sm:rounded-[37px] bg-none sm:bg-[#FDFDFD]">
        <SectionHeader
          title="Profile Picture"
          icon={Camera}
          subheader="Update your profile picture"
        />
        <div className="mt-4 sm:mt-6 flex flex-col items-center gap-3 sm:gap-4">
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
              className="justify-center h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto cursor-pointer transition"
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
            <p className="text-[12px] sm:text-xs text-gray-500">
              Recommended: Square image, max 5MB
            </p>
          </div>
        </div>
      </div>
      {/* Personal Information Section */}
      <form
        onSubmit={handleSubmit(onSubmitPersonalInfo)}
        className="flex flex-col py-4 px-4 sm:py-6 sm:px-6 rounded-2xl sm:rounded-[37px] bg-[#FDFDFD] mb-4 sm:mb-5"
      >
        <div className="flex flex-col">
          <SectionHeader
            title="Personal Information"
            icon={User2Icon}
            subheader="Update your name and email"
          />
          <div className="mt-3 sm:mt-4 flex flex-col md:flex-row gap-3 sm:gap-4">
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
          <div className="mt-4 sm:mt-6 flex justify-end">
            <Button
              type="submit"
              className={`justify-center mt-2.5 sm:mt-4 h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto cursor-pointer  transition 
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
        className="flex flex-col py-4 px-4 sm:py-6 sm:px-6 rounded-2xl sm:rounded-[37px] bg-[#FDFDFD]"
      >
        <div className="flex flex-col">
          <SectionHeader
            title="Change Password"
            icon={Settings}
            subheader="Update your password"
          />
          <div className="mt-3 sm:mt-4 flex flex-col md:flex-row gap-3 sm:gap-4">
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
          <div className="mt-4 sm:mt-6 flex justify-end">
            <Button
              type="submit"
              className={`justify-center mt-2.5 sm:mt-4 h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto cursor-pointer  transition 
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

      {/* Followers & Following Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Followers */}
        <div className="flex flex-col py-4 px-4 sm:py-6 sm:px-6 rounded-2xl sm:rounded-[37px] bg-[#FDFDFD]">
          <SectionHeader
            title={`Followers (${followers?.followers?.length ?? 0})`}
            icon={Users}
            subheader="Teachers who keep up with your moderation posts activity"
          />

          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {isFollowersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white animate-pulse"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (followers?.followers?.length ?? 0) === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-2xl bg-white">
                <Users className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  No followers yet. Engage with the community to gain followers.
                </p>
              </div>
            ) : (
              followers?.followers?.map((person: any) => (
                <div
                  key={person.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-white hover:shadow-sm transition-shadow"
                >
                  <UserAvatar
                    profilePictureUrl={person.profilePictureUrl}
                    name={person.name}
                    email={person.email}
                    size="md"
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {person.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {person.email || "No email available"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Following */}
        <div className="flex flex-col py-4 px-4 sm:py-6 sm:px-6 rounded-2xl sm:rounded-[37px] bg-[#FDFDFD]">
          <SectionHeader
            title={`Following (${followingUsers?.following?.length ?? 0})`}
            icon={UserPlus}
            subheader="Teachers you currently follow"
          />

          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {isFollowingUsersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white animate-pulse"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (followingUsers?.following?.length ?? 0) === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-2xl bg-white">
                <UserPlus className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  You&apos;re not following anyone yet. Discover Teachers to
                  follow from the grading feed.
                </p>
              </div>
            ) : (
              followingUsers?.following?.map((person: any) => (
                <div
                  key={person.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-white hover:shadow-sm transition-shadow"
                >
                  <UserAvatar
                    profilePictureUrl={person.profilePictureUrl}
                    name={person.name}
                    email={person.email}
                    size="md"
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {person.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {person.email || "No email available"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="flex flex-col py-4 px-4 sm:py-6 sm:px-6 rounded-2xl sm:rounded-[37px] bg-[#FDFDFD] border-2 border-red-100">
        <SectionHeader
          title="Delete Account"
          icon={AlertTriangle}
          subheader="Permanently delete your account"
        />
        <div className="mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="text-[13px] sm:text-sm font-medium text-red-800">
                  Warning: This action cannot be undone
                </p>
                <p className="text-[12px] sm:text-xs text-red-700">
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
            className="justify-center mt-2 h-11 sm:h-12 text-sm sm:text-base cursor-pointer w-full sm:w-auto self-start"
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {isMobile ? (
        <BottomSheet
          isOpen={isDeleteAccountModalOpen}
          onClose={() => setIsDeleteAccountModalOpen(false)}
          title="Delete Account"
        >
          <div className="p-4">
            <DeleteAccountModal />
          </div>
        </BottomSheet>
      ) : (
        <Modal
          isOpen={isDeleteAccountModalOpen}
          onOpenChange={setIsDeleteAccountModalOpen}
        >
          <Modal.Content>
            <DeleteAccountModal />
          </Modal.Content>
        </Modal>
      )}
    </div>
  );
}
