"use client";

import { useState, useEffect, useMemo } from "react";
import { useResponsiveModal } from "@/hooks/useResponsiveModal";
import { X, Users, Search, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useForm, Controller } from "react-hook-form";
import { useCreateGroupChat } from "@/hooks/useMessage";
import { CreateGroupInput } from "@/app/types/groupChat";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSearchUsers } from "@/hooks/useUser";
import { User } from "@/app/types/user";
import UserAvatar from "@/components/UserAvatar";
import { decoded } from "@/lib/currentUser";

export default function CreateGroupModal() {
  const { close } = useResponsiveModal();
  const router = useRouter();
  const currentUserId = decoded?.id || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [page, setPage] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateGroupInput>();

  const { createGroupChatAsync, isCreatingGroup, isCreateGroupSuccess } =
    useCreateGroupChat();

  // Fetch users for selection using the user search endpoint
  const { users, isSearchingUsers } = useSearchUsers(page, 10, searchTerm);

  // Filter out current user and already selected members
  const availableUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(
      (user: User) =>
        user.id !== currentUserId &&
        !selectedMembers.some((selected) => selected.id === user.id)
    );
  }, [users, currentUserId, selectedMembers]);

  const onSubmit = async (data: CreateGroupInput) => {
    if (selectedMembers.length < 2) {
      toast.error("Please select at least 2 members for the group");
      return;
    }

    try {
      const memberIds = selectedMembers.map((member) => member.id || "");
      const result = await createGroupChatAsync({
        name: data.name,
        memberIds: memberIds as string[],
      });

      if (result?.conversation) {
        toast.success("Group created successfully!");
        close();
        // Navigate to the new group chat
        router.push(
          `/dashboard/teacher/messages?conversationId=${result.conversation.id}`
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to create group");
    }
  };

  const toggleMemberSelection = (user: User) => {
    setSelectedMembers((prev) => {
      if (prev.some((m) => m.id === user.id)) {
        return prev.filter((m) => m.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] max-h-[90vh] overflow-y-auto scrollbar-hide p-6 sm:p-10 rounded-[27px] flex flex-col"
    >
      {/* Header */}
      <div className="flex flex-row justify-between items-start gap-3 mb-6">
        <div className="flex flex-col gap-1.5">
          <p className="text-xl text-[#0c0c0c] font-medium">
            Create Group Chat
          </p>
          <p className="text-base font-normal text-[#717171]">
            Start a group conversation with multiple teachers
          </p>
        </div>
        <button
          type="button"
          onClick={close}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <X width={22} height={22} className="text-[#000000]" />
        </button>
      </div>

      {/* Group Name Input */}
      <div className="mb-6">
        <Input
          label="Group Name"
          type="text"
          placeholder="e.g., ECBA Moderators Group"
          error={errors.name?.message}
          {...register("name", {
            required: "Group name is required",
            minLength: {
              value: 3,
              message: "Group name must be at least 3 characters",
            },
          })}
        />
      </div>

      {/* Selected Members Preview */}
      {selectedMembers.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Selected Members ({selectedMembers.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
              >
                <UserAvatar
                  profilePictureUrl={member.profilePictureUrl}
                  name={member.name}
                  size="sm"
                  className="w-6 h-6"
                />
                <span className="text-sm text-gray-800">{member.name}</span>
                <button
                  type="button"
                  onClick={() => toggleMemberSelection(member)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X width={14} height={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Users */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search teachers to add..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Select Members (minimum 2)
        </p>
        <div className="max-h-[300px] overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
          {isSearchingUsers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-600">
                Loading users...
              </span>
            </div>
          ) : availableUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              {searchTerm ? "No users found" : "No users available"}
            </div>
          ) : (
            availableUsers.map((user: User) => {
              const isSelected = selectedMembers.some((m) => m.id === user.id);
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleMemberSelection(user)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <UserAvatar
                    profilePictureUrl={user.profilePictureUrl}
                    name={user.name}
                    size="md"
                    className="w-10 h-10"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <X width={12} height={12} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={close}
          disabled={isCreatingGroup}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isCreatingGroup || selectedMembers.length < 2}
          icon={<Users size={18} />}
        >
          {isCreatingGroup ? "Creating..." : "Create Group"}
        </Button>
      </div>
    </form>
  );
}
