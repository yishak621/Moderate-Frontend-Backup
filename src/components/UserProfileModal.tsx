"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Calendar,
  MessageSquare,
  UserPlus,
  UserMinus,
  Ban,
  Shield,
  FileText,
  Award,
  MessageCircle,
  Users,
  Loader2,
  ExternalLink,
  Briefcase,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useBlockUser, useUnblockUser } from "@/hooks/useMessage";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { decoded } from "@/lib/currentUser";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onBlock?: () => void;
  onUnblock?: () => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  userId,
  onBlock,
  onUnblock,
}: UserProfileModalProps) {
  const router = useRouter();
  const currentUserId = decoded?.id;
  const isOwnProfile = userId === currentUserId;

  const {
    profile,
    stats,
    relationship,
    isProfileLoading,
    isProfileError,
    refetchProfile,
  } = useUserProfile(isOpen ? userId : null);

  const { blockUserAsync, isBlockingUser } = useBlockUser();
  const { unblockUserAsync, isUnblockingUser } = useUnblockUser();

  const handleMessage = () => {
    if (profile) {
      router.push(`/dashboard/teacher/messages?chatId=${profile.id}`);
      onClose();
    }
  };

  const handleBlock = async () => {
    if (!userId) return;
    try {
      await blockUserAsync({ userId });
      toast.success(`${profile?.name || "User"} has been blocked`);
      refetchProfile();
      onBlock?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to block user");
    }
  };

  const handleUnblock = async () => {
    if (!userId) return;
    try {
      await unblockUserAsync(userId);
      toast.success(`${profile?.name || "User"} has been unblocked`);
      refetchProfile();
      onUnblock?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to unblock user");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      TEACHER: {
        label: "Teacher",
        icon: Briefcase,
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
      },
      STUDENT: {
        label: "Student",
        icon: GraduationCap,
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        borderColor: "border-green-200",
      },
      ADMIN: {
        label: "Admin",
        icon: Shield,
        bgColor: "bg-purple-100",
        textColor: "text-purple-700",
        borderColor: "border-purple-200",
      },
    };
    return roleConfig[role as keyof typeof roleConfig] || roleConfig.STUDENT;
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
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              {isProfileLoading ? (
                /* Loading State */
                <div className="p-8">
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-500">Loading profile...</p>
                  </div>
                </div>
              ) : isProfileError ? (
                /* Error State */
                <div className="p-8">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                      <X className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-gray-700 font-medium">Failed to load profile</p>
                    <p className="text-gray-400 text-sm mt-1">Please try again later</p>
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : profile ? (
                <>
                  {/* Header with gradient background */}
                  <div className="relative">
                    {/* Gradient Background */}
                    <div className="h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700" />
                    
                    {/* Close Button */}
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Profile Picture - Overlapping */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                      <div className="relative">
                        {profile.profilePictureUrl ? (
                          <Image
                            src={profile.profilePictureUrl}
                            alt={profile.name}
                            width={128}
                            height={128}
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 border-4 border-white shadow-xl flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">
                              {profile.name?.[0]?.toUpperCase() || "?"}
                            </span>
                          </div>
                        )}
                        {/* Online indicator or role badge on avatar */}
                        {relationship?.canMessage && !relationship?.isBlocked && (
                          <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-20 pb-6 px-6">
                    {/* Name and Role */}
                    <div className="text-center mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                      {profile.shortname && (
                        <p className="text-gray-500 text-sm">@{profile.shortname}</p>
                      )}
                      
                      {/* Role Badge */}
                      {(() => {
                        const roleInfo = getRoleBadge(profile.role);
                        const RoleIcon = roleInfo.icon;
                        return (
                          <div className="flex justify-center mt-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${roleInfo.bgColor} ${roleInfo.textColor} ${roleInfo.borderColor}`}
                            >
                              <RoleIcon className="w-4 h-4" />
                              {roleInfo.label}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Info Row */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        <span className="truncate max-w-[180px]">{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {formatDate(profile.joinedAt)}</span>
                      </div>
                    </div>

                    {/* Domains/Subjects */}
                    {profile.domains && profile.domains.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {profile.domains.map((domain) => (
                          <span
                            key={domain.id}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                          >
                            {domain.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats Grid */}
                    {stats && (
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <div className="flex justify-center mb-1">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <p className="text-xl font-bold text-gray-900">{stats.postCount}</p>
                          <p className="text-xs text-gray-500">Posts</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <div className="flex justify-center mb-1">
                            <Users className="w-5 h-5 text-green-500" />
                          </div>
                          <p className="text-xl font-bold text-gray-900">{stats.followersCount}</p>
                          <p className="text-xs text-gray-500">Followers</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <div className="flex justify-center mb-1">
                            <MessageCircle className="w-5 h-5 text-purple-500" />
                          </div>
                          <p className="text-xl font-bold text-gray-900">{stats.commentsCount}</p>
                          <p className="text-xs text-gray-500">Comments</p>
                        </div>
                      </div>
                    )}

                    {/* Relationship Status Banner */}
                    {relationship?.isBlocked && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl mb-4">
                        <Ban className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-red-700 font-medium">
                          You have blocked this user
                        </span>
                      </div>
                    )}
                    {relationship?.isBlockedByThem && !relationship?.isBlocked && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl mb-4">
                        <Shield className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-600 font-medium">
                          This user has restricted who can message them
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {!isOwnProfile && (
                      <div className="flex gap-3">
                        {/* Message Button */}
                        {relationship?.canMessage && (
                          <Button
                            variant="primary"
                            className="flex-1"
                            onClick={handleMessage}
                            icon={<MessageSquare className="w-4 h-4" />}
                          >
                            Message
                          </Button>
                        )}

                        {/* Block/Unblock Button */}
                        {relationship?.isBlocked ? (
                          <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={handleUnblock}
                            disabled={isUnblockingUser}
                            icon={
                              isUnblockingUser ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )
                            }
                          >
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            className="flex-1 text-red-600 hover:bg-red-50"
                            onClick={handleBlock}
                            disabled={isBlockingUser}
                            icon={
                              isBlockingUser ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )
                            }
                          >
                            Block
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Own Profile - View Full Profile */}
                    {isOwnProfile && (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => {
                          router.push("/dashboard/teacher/profile");
                          onClose();
                        }}
                        icon={<ExternalLink className="w-4 h-4" />}
                      >
                        View Full Profile
                      </Button>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

