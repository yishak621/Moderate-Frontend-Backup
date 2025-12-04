"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  Crown,
  UserPlus,
  UserMinus,
  Search,
  Loader2,
  Shield,
  Mail,
  Calendar,
  AlertTriangle,
  Check,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import {
  useGetGroupMembers,
  useAddGroupMembers,
  useRemoveGroupMember,
} from "@/hooks/useMessage";
import { useSearchUsers } from "@/hooks/useUser";
import { decoded } from "@/lib/currentUser";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import UserAvatar from "@/components/UserAvatar";
import { User } from "@/app/types/user";

interface GroupMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
}

interface Member {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  isOwner?: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
    role: string;
  };
}

interface ConfirmRemoveState {
  isOpen: boolean;
  userId: string;
  userName: string;
}

export default function GroupMembersModal({
  isOpen,
  onClose,
  conversationId,
}: GroupMembersModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [addMemberSearch, setAddMemberSearch] = useState("");
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<User[]>([]);
  const [confirmRemove, setConfirmRemove] = useState<ConfirmRemoveState>({
    isOpen: false,
    userId: "",
    userName: "",
  });

  const currentUserId = decoded?.id || "";

  const {
    members,
    memberCount,
    groupName,
    isOwner, // From API response - true only for group owner
    isGroupMembersLoading,
    isGroupMembersError,
    refetchGroupMembers,
  } = useGetGroupMembers(conversationId);

  const { addGroupMembersAsync, isAddingMembers } = useAddGroupMembers();
  const { removeGroupMemberAsync, isRemovingMember } = useRemoveGroupMember();

  // Fetch users for adding - only fetch when owner opens add panel
  const { users, isSearchingUsers } = useSearchUsers(
    1,
    20,
    isOwner && showAddMember ? addMemberSearch : ""
  );

  // Get existing member IDs
  const existingMemberIds = useMemo(() => {
    return new Set(members.map((m: Member) => m.userId));
  }, [members]);

  // Filter available users (not already in group, not current user)
  const availableUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(
      (user: User) =>
        user.id !== currentUserId &&
        !existingMemberIds.has(user.id) &&
        !selectedUsersToAdd.some((selected) => selected.id === user.id)
    );
  }, [users, currentUserId, existingMemberIds, selectedUsersToAdd]);

  const filteredMembers = members.filter(
    (member: Member) =>
      member.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openRemoveConfirmation = (userId: string, userName: string) => {
    setConfirmRemove({ isOpen: true, userId, userName });
  };

  const closeRemoveConfirmation = () => {
    setConfirmRemove({ isOpen: false, userId: "", userName: "" });
  };

  const handleRemoveMember = async () => {
    const { userId, userName } = confirmRemove;

    try {
      await removeGroupMemberAsync({ conversationId, userId });
      toast.success(`${userName} has been removed from the group`);
      closeRemoveConfirmation();
      refetchGroupMembers();
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove member");
    }
  };

  const toggleUserSelection = (user: User) => {
    setSelectedUsersToAdd((prev) => {
      if (prev.some((u) => u.id === user.id)) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleAddMembers = async () => {
    if (selectedUsersToAdd.length === 0) {
      toast.error("Please select at least one member to add");
      return;
    }

    try {
      const memberIds = selectedUsersToAdd.map((u) => u.id || "");
      await addGroupMembersAsync({
        conversationId,
        data: { memberIds: memberIds as string[] },
      });
      toast.success(
        `${selectedUsersToAdd.length} member${
          selectedUsersToAdd.length > 1 ? "s" : ""
        } added successfully`
      );
      setSelectedUsersToAdd([]);
      setAddMemberSearch("");
      setShowAddMember(false);
      refetchGroupMembers();
    } catch (error: any) {
      toast.error(error?.message || "Failed to add members");
    }
  };

  const closeAddMemberPanel = () => {
    setShowAddMember(false);
    setSelectedUsersToAdd([]);
    setAddMemberSearch("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-6 py-8 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {groupName || "Group Members"}
                    </h2>
                    <p className="text-white/80 flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4" />
                      {memberCount} {memberCount === 1 ? "member" : "members"}
                    </p>
                  </div>
                </div>

                {/* Owner badge */}
                {isOwner && (
                  <div className="absolute bottom-4 right-6 flex items-center gap-2 px-3 py-1.5 bg-yellow-400/20 rounded-full">
                    <Crown className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-medium text-yellow-200">
                      You&apos;re the owner
                    </span>
                  </div>
                )}
              </div>

              {/* Search & Add Member */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search members..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => setShowAddMember(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Members List */}
              <div className="overflow-y-auto max-h-[400px] px-6 py-4">
                {isGroupMembersLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                    <p className="text-gray-500">Loading members...</p>
                  </div>
                ) : isGroupMembersError ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                      <X className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      Unable to load members
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Only the group owner can view member details
                    </p>
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      No members found
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchQuery
                        ? "Try a different search term"
                        : "This group has no members"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredMembers.map((member: Member) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                      >
                        {/* Avatar */}
                        <div className="relative">
                          {member.user?.profilePictureUrl ? (
                            <Image
                              src={member.user.profilePictureUrl}
                              alt={member.user.name || ""}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-white shadow-md">
                              <span className="text-white font-semibold text-lg">
                                {member.user?.name?.[0]?.toUpperCase() || "?"}
                              </span>
                            </div>
                          )}
                          {member.isOwner && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800 truncate">
                              {member.user?.name || ""}
                            </h4>
                            {member.isOwner && (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                Owner
                              </span>
                            )}
                            {member.role === "admin" && !member.isOwner && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1 truncate">
                              <Mail className="w-3.5 h-3.5" />
                              {member.user?.email || "No email"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            Joined {formatDate(member.joinedAt)}
                          </div>
                        </div>

                        {/* Actions - Only for owner, can't remove themselves */}
                        {isOwner && !member.isOwner && (
                          <button
                            onClick={() =>
                              openRemoveConfirmation(
                                member.userId,
                                member.user?.name || "Unknown"
                              )
                            }
                            className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                            title="Remove member"
                          >
                            <UserMinus className="w-5 h-5" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>

          {/* Remove Member Confirmation Modal */}
          <AnimatePresence>
            {confirmRemove.isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-[60]"
                  onClick={closeRemoveConfirmation}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", duration: 0.3 }}
                  className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    {/* Header with Icon */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Remove Member
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Are you sure you want to remove{" "}
                          <span className="font-semibold text-gray-800">
                            {confirmRemove.userName}
                          </span>{" "}
                          from this group? They will no longer be able to see or
                          send messages.
                        </p>
                      </div>
                      <button
                        onClick={closeRemoveConfirmation}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={closeRemoveConfirmation}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="red"
                        className="flex-1"
                        onClick={handleRemoveMember}
                        disabled={isRemovingMember}
                      >
                        {isRemovingMember ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Removing...
                          </span>
                        ) : (
                          "Remove"
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Add Members Panel */}
          <AnimatePresence>
            {showAddMember && isOwner && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-[60]"
                  onClick={closeAddMemberPanel}
                />
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                      <button
                        onClick={closeAddMemberPanel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Add Members
                        </h3>
                        <p className="text-sm text-gray-500">
                          Select users to add to {groupName}
                        </p>
                      </div>
                      <button
                        onClick={closeAddMemberPanel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Selected Users Preview */}
                    {selectedUsersToAdd.length > 0 && (
                      <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                        <p className="text-sm font-medium text-blue-800 mb-2">
                          Selected ({selectedUsersToAdd.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedUsersToAdd.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-2 py-1"
                            >
                              <UserAvatar
                                profilePictureUrl={user.profilePictureUrl}
                                name={user.name}
                                size="sm"
                                className="w-5 h-5"
                              />
                              <span className="text-sm text-gray-800">
                                {user.name}
                              </span>
                              <button
                                onClick={() => toggleUserSelection(user)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <X width={14} height={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Search */}
                    <div className="px-6 py-4 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={addMemberSearch}
                          onChange={(e) => setAddMemberSearch(e.target.value)}
                          placeholder="Search users to add..."
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Users List */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      {isSearchingUsers ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
                          <p className="text-gray-500 text-sm">
                            Loading users...
                          </p>
                        </div>
                      ) : availableUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <Users className="w-7 h-7 text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium">
                            {addMemberSearch
                              ? "No users found"
                              : "No more users to add"}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            {addMemberSearch
                              ? "Try a different search term"
                              : "All users are already members"}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {availableUsers.map((user: User) => {
                            const isSelected = selectedUsersToAdd.some(
                              (u) => u.id === user.id
                            );
                            return (
                              <button
                                key={user.id}
                                onClick={() => toggleUserSelection(user)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                                  isSelected
                                    ? "bg-blue-50 border-2 border-blue-500"
                                    : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
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
                                  <p className="text-xs text-gray-500">
                                    {user.email}
                                  </p>
                                </div>
                                {isSelected && (
                                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={closeAddMemberPanel}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={handleAddMembers}
                        disabled={
                          isAddingMembers || selectedUsersToAdd.length === 0
                        }
                      >
                        {isAddingMembers ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Adding...
                          </span>
                        ) : (
                          `Add ${
                            selectedUsersToAdd.length > 0
                              ? `(${selectedUsersToAdd.length})`
                              : ""
                          }`
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
