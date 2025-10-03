import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { User } from "@/app/types/user";
import { useAdminUserDeleteData } from "@/hooks/UseAdminRoutes";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

export default function DeleteUserModal({ user }: { user: User }) {
  const {
    deleteUserData,
    deleteUserDataAsync,
    isDeletingUserDataLoading,
    isDeletingUserDataSuccess,
    isDeletingUserDataError,
    deletingUserDataError,
  } = useAdminUserDeleteData(user.id);
  const { close } = useModal();

  useEffect(() => {
    if (isDeletingUserDataSuccess) {
      toast.success("User deleted successfully");
      close();
    }
  }, [isDeletingUserDataSuccess]);

  if (!user) return null;

  return (
    <div className=" bg-[#FDFDFD] min-w-[551px] p-10 rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className=" flex flex-col gap-1.5">
          <p className=" text-xl text-[#0c0c0c] font-medium">Delete Teacher</p>
          <p className=" text-base font-normal text-[#717171] max-w-[303px]">
            Are you sure to delete <b>{user?.name}</b> account from your
            platform
          </p>
        </div>

        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>

      <div className=" flex justify-center gap-3 items-center w-full mt-12">
        <div className="w-1/3 ">
          <Button className="w-full" variant="secondary" onClick={close}>
            Cancel
          </Button>
        </div>
        <div className="w-2/3">
          {" "}
          {/* <Button className="w-full" variant="red" 
          onClick={() => {
            deleteUserDataAsync();
            if (isDeletingUserDataSuccess) {
              toast.success("User deleted successfully");
            }
          }}>
            Delete Teacher
          </Button> */}
          {/* Update Button */}
          <Button
            variant="red"
            className={`justify-center  text-base cursor-pointer w-full transition 
        ${isDeletingUserDataLoading && "opacity-70 cursor-not-allowed"}`}
            disabled={isDeletingUserDataLoading}
            onClick={() => {
              deleteUserDataAsync();
            }}
          >
            {isDeletingUserDataLoading ? (
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
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
