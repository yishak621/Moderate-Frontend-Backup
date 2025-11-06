import { useModal } from "@/components/ui/Modal";
import { useBottomSheet } from "@/components/ui/BottomSheet";
import { X, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useDeleteAccount } from "@/hooks/useUser";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { removeToken } from "@/services/tokenService";
import { queryClient } from "@/lib/queryClient";

export default function DeleteAccountModal() {
  const {
    deleteAccountAsync,
    isDeletingAccountLoading,
    isDeletingAccountSuccess,
    isDeletingAccountError,
    deletingAccountError,
  } = useDeleteAccount();
  const modalCtx = useModal();
  const sheetCtx = useBottomSheet();
  const close = sheetCtx?.isOpen ? sheetCtx.close : modalCtx.close;
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");

  useEffect(() => {
    if (isDeletingAccountSuccess) {
      toast.success("Account deleted successfully");
      queryClient.clear();
      removeToken();
      close();
      router.push("/auth/login");
    }
  }, [isDeletingAccountSuccess, close, router]);

  useEffect(() => {
    if (isDeletingAccountError && deletingAccountError) {
      const errorMessage =
        deletingAccountError instanceof Error
          ? deletingAccountError.message
          : "Failed to delete account";
      toast.error(errorMessage);
    }
  }, [isDeletingAccountError, deletingAccountError]);

  const handleDelete = async () => {
    if (confirmDelete !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm");
      return;
    }

    try {
      await deleteAccountAsync(password || undefined);
    } catch (err) {
      // Error handled in useEffect
    }
  };

  return (
    <div className="bg-[#FDFDFD] w-full max-w-[600px] mx-auto p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-[27px] flex flex-col">
      {/* Header */}
      <div className="flex flex-row justify-between items-start mb-4 md:mb-6">
        <div className=" hidden md:flex flex-col gap-1.5">
          <div className="flex items-center gap-2 md:gap-3">
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            <p className="text-lg md:text-xl text-[#0c0c0c] font-medium">
              Delete Account
            </p>
          </div>
          <p className="text-sm md:text-base font-normal text-[#717171] md:max-w-[450px]">
            This action cannot be undone. This will permanently delete your
            account and remove all associated data from our servers.
          </p>
        </div>

        <div className="hidden md:block" onClick={close}>
          <X width={20} height={20} className="text-[#000000] cursor-pointer" />
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="text-[13px] md:text-sm font-medium text-red-800">
              Warning: Permanent Action
            </p>
            <p className="text-[12px] md:text-xs text-red-700">
              All your posts, grades, comments, and profile data will be
              permanently deleted. This action cannot be reversed.
            </p>
          </div>
        </div>
      </div>

      {/* Password Confirmation */}
      <div className="mb-3 md:mb-4">
        <Input
          type="password"
          label="Password (Optional)"
          placeholder="Enter your password to confirm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />
        <p className="text-[12px] md:text-xs text-gray-500 mt-1">
          Some accounts may require password confirmation for security.
        </p>
      </div>

      {/* Confirmation Text */}
      <div className="mb-4 md:mb-6">
        <label className="block text-[13px] md:text-sm font-medium text-gray-700 mb-2">
          Type <span className="font-bold">DELETE</span> to confirm:
        </label>
        <Input
          type="text"
          placeholder="DELETE"
          value={confirmDelete}
          onChange={(e) => setConfirmDelete(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-3 items-center w-full">
        <div className="w-full sm:w-1/3">
          <Button
            className="w-full h-11 md:h-12 text-sm md:text-base"
            variant="secondary"
            onClick={close}
          >
            Cancel
          </Button>
        </div>
        <div className="w-full sm:w-2/3">
          <Button
            variant="red"
            className={`justify-center h-11 md:h-12 text-sm md:text-base cursor-pointer w-full transition 
        ${isDeletingAccountLoading && "opacity-70 cursor-not-allowed"}`}
            disabled={isDeletingAccountLoading || confirmDelete !== "DELETE"}
            onClick={handleDelete}
          >
            {isDeletingAccountLoading ? (
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
              "Delete Account"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
