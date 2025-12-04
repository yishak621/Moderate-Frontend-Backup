"use client";

import { useState } from "react";
import { Users, Settings, UserPlus, UserMinus, Crown } from "lucide-react";
import { GroupConversation, GroupMember } from "@/app/types/groupChat";
import UserAvatar from "@/components/UserAvatar";
import { decoded } from "@/lib/currentUser";
import { useAddGroupMembers, useRemoveGroupMember } from "@/hooks/useMessage";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
import { useSearchUsers } from "@/hooks/useUser";
import { User } from "@/app/types/user";
import { Search, X, Loader2 } from "lucide-react";
import Input from "@/components/ui/Input";

interface GroupChatHeaderProps {
  conversation: GroupConversation;
  onMembersUpdated?: () => void;
}

export default function GroupChatHeader({
  conversation,
  onMembersUpdated,
}: GroupChatHeaderProps) {
  const currentUserId = decoded?.id || "";
  const currentUserMember = conversation.members.find(
    (m) => m.userId === currentUserId
  );
  const isAdmin = currentUserMember?.role === "admin";

  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { addGroupMembersAsync, isAddingMembers } = useAddGroupMembers();
  const { removeGroupMemberAsync, isRemovingMember } = useRemoveGroupMember();

  const { users, isSearchingUsers } = useSearchUsers(1, 10, searchTerm);

  // Get members not already in the group
  const availableUsers = users?.filter(
    (user: User) =>
      user.id !== currentUserId &&
      !conversation.members.some((m) => m.userId === user.id)
  ) || [];

  const handleAddMembers = async (memberIds: string[]) => {
    try {
      await addGroupMembersAsync({
        conversationId: conversation.id,
        data: { memberIds },
      });
      toast.success("Members added successfully!");
      setShowAddMembersModal(false);
      onMembersUpdated?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to add members");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeGroupMemberAsync({
        conversationId: conversation.id,
        userId,
      });
      toast.success("Member removed successfully!");
      onMembersUpdated?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove member");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-[#368FFF] flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[#0C0C0C] text-base font-medium truncate">
              {conversation.name}
            </h4>
            <p className="text-xs text-gray-500">
              {conversation.members.length} member
              {conversation.members.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowMembersModal(true)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          title="View group members"
        >
          <Settings size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Members Modal */}
      <ResponsiveModal
        isOpen={showMembersModal}
        onOpenChange={setShowMembersModal}
      >
        <div className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] max-h-[90vh] overflow-y-auto p-6 sm:p-10 rounded-[27px] flex flex-col">
          {/* Header */}
          <div className="flex flex-row justify-between items-start gap-3 mb-6">
            <div className="flex flex-col gap-1.5">
              <p className="text-xl text-[#0c0c0c] font-medium">Group Members</p>
              <p className="text-base font-normal text-[#717171]">
                {conversation.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowMembersModal(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <X width={22} height={22} className="text-[#000000]" />
            </button>
          </div>

          {/* Members List */}
          <div className="space-y-3 mb-6">
            {conversation.members.map((member) => {
              const isCurrentUser = member.userId === currentUserId;
              const canRemove =
                isAdmin || isCurrentUser; // Admin can remove anyone, user can remove self

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <UserAvatar user={member.user} size="md" className="w-10 h-10" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.user.name}
                        </p>
                        {member.role === "admin" && (
                          <Crown className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  {canRemove && !isCurrentUser && (
                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      disabled={isRemovingMember}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove member"
                    >
                      <UserMinus size={18} />
                    </button>
                  )}
                  {isCurrentUser && (
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                      You
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Members Button */}
          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => {
                setShowMembersModal(false);
                setShowAddMembersModal(true);
              }}
              icon={<UserPlus size={18} />}
              className="w-full"
            >
              Add Members
            </Button>
          )}
        </div>
      </ResponsiveModal>

      {/* Add Members Modal */}
      <ResponsiveModal
        isOpen={showAddMembersModal}
        onOpenChange={setShowAddMembersModal}
      >
        <div className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] max-h-[90vh] overflow-y-auto p-6 sm:p-10 rounded-[27px] flex flex-col">
          {/* Header */}
          <div className="flex flex-row justify-between items-start gap-3 mb-6">
            <div className="flex flex-col gap-1.5">
              <p className="text-xl text-[#0c0c0c] font-medium">Add Members</p>
              <p className="text-base font-normal text-[#717171]">
                Add new members to {conversation.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddMembersModal(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <X width={22} height={22} className="text-[#000000]" />
            </button>
          </div>

          {/* Search */}
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
            <div className="max-h-[400px] overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
              {isSearchingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="ml-2 text-sm text-gray-600">
                    Loading users...
                  </span>
                </div>
              ) : availableUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  {searchTerm ? "No users found" : "No users available to add"}
                </div>
              ) : (
                availableUsers.map((user: User) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleAddMembers([user.id])}
                    disabled={isAddingMembers}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <UserAvatar user={user} size="md" className="w-10 h-10" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Close Button */}
          <Button
            variant="outline"
            onClick={() => setShowAddMembersModal(false)}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </ResponsiveModal>
    </>
  );
}

