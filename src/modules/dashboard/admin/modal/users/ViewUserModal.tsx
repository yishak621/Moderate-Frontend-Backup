import { useModal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { User } from "@/app/types/user";

export default function ViewUserModal({ user }: { user: User }) {
  const { close } = useModal();
  if (!user) return null;

  return (
    <div className="bg-[#FDFDFD] min-w-[551px] p-10 rounded-[27px] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          <p className="text-xl text-[#0c0c0c] font-medium">{user.name}</p>
          <p className="text-base font-normal text-[#717171] max-w-[400px]">
            {user.email} • {user.role}
          </p>
        </div>
        <div onClick={close}>
          <X width={22} height={22} className="text-[#000000] cursor-pointer" />
        </div>
      </div>

      {/* User Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Verification Status</span>
          <span
            className={`px-2 py-0.5 mt-1 rounded-full text-xs font-medium ${
              user.verificationStatus === "active"
                ? "bg-green-100 text-green-700"
                : user.verificationStatus === "suspended"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {user.verificationStatus}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Account Status</span>
          <span className="text-sm mt-1">
            {user.isDisabled ? "Disabled" : "Active"}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Free Trial</span>
          <span className="text-sm mt-1">
            {user.hasUsedFreeTrial
              ? `Used (${new Date(
                  user.freeTrialStartDate || ""
                ).toLocaleDateString()} - ${new Date(
                  user.freeTrialEndDate || ""
                ).toLocaleDateString()})`
              : "Available"}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Subscription</span>
          <span className="text-sm mt-1">
            {user.subscriptionStatus || ""}{" "}
            {user.subscriptionPlan ? `(${user.subscriptionPlan})` : ""}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Last Seen</span>
          <span className="text-sm mt-1">
            {user.lastSeen
              ? new Date(user.lastSeen).toLocaleDateString()
              : "Never"}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Account Created</span>
          <span className="text-sm mt-1">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "no date"}
          </span>
        </div>
      </div>
    </div>
  );
}
