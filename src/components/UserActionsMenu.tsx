"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  UserPlus,
  UserMinus,
  MessageSquare,
  Heart,
  HeartOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  useFollowUser,
  useUnfollowUser,
  useGetFollowingUsers,
} from "@/hooks/useUser";
import {
  useAddToFavorites,
  useRemoveFromFavorites,
  useFavoritePosts,
} from "@/hooks/useUser";
import { useThreads } from "@/hooks/useMessage";
import ComposeNewMessageModal from "@/modules/dashboard/teacher/messages/ComposeNewMessageModal";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
import { decoded } from "@/lib/currentUser";
import { PostAttributes } from "@/types/postAttributes";
import toast from "react-hot-toast";
import { ComponentType } from "react";

interface UserActionsMenuProps {
  userId: string;
  postId: string;
  userName?: string;
  isMobile?: boolean;
  post?: PostAttributes; // Optional post data for ComposeNewMessageModal
}

export default function UserActionsMenu({
  userId,
  postId,
  userName = "User",
  isMobile = false,
  post,
}: UserActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalComponent, setModalComponent] =
    useState<ComponentType<any> | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleOpenModal = <P,>(component: ComponentType<P>, props?: P) => {
    setModalComponent(() => component);
    setModalProps(props || {});
    setIsModalOpen(true);
  };

  const { followUser, isFollowingUserLoading } = useFollowUser();
  const { unfollowUser, isUnfollowingUserLoading } = useUnfollowUser();
  const { followingUsers } = useGetFollowingUsers();
  const { addToFavoritesAsync, isAddingToFavoritesLoading } =
    useAddToFavorites();
  const { removeFromFavoritesAsync, isRemovingFromFavoritesLoading } =
    useRemoveFromFavorites();
  const { favoritePostsData } = useFavoritePosts();

  // Get threads to check if user has chatted before
  const currentUserId = decoded?.id || "";
  const { threads } = useThreads(currentUserId);

  // Check if user has chatted before
  // Check if there's a thread with this user (by partnerId)
  const didUserChatWithMe =
    threads?.data?.some((thread: any) => thread.partnerId === userId) || false;

  // Check if user is being followed
  const isFollowing =
    followingUsers?.following?.some((user: any) => user.id === userId) || false;

  // Check if post is favorited (from API)
  const initialIsFavorited =
    favoritePostsData?.posts?.some((post: any) => post.id === postId) || false;

  // Local state for optimistic updates
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const isMutatingFavorite =
    isAddingToFavoritesLoading || isRemovingFromFavoritesLoading;

  // Update local state when API data changes
  useEffect(() => {
    setIsFavorited(initialIsFavorited);
  }, [initialIsFavorited]);
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleFollow = () => {
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
    setIsOpen(false);
  };

  const handleFavoriteToggle = async () => {
    if (isMutatingFavorite || !postId) return;

    if (isFavorited) {
      setIsFavorited(false);
      try {
        await removeFromFavoritesAsync(postId);
      } catch (error) {
        setIsFavorited(true); // Revert on error
        toast.error("Failed to remove from favorites");
      }
    } else {
      setIsFavorited(true);
      try {
        await addToFavoritesAsync(postId);
      } catch (error) {
        setIsFavorited(false); // Revert on error
        toast.error("Failed to add to favorites");
      }
    }
    setIsOpen(false);
  };

  const handleChat = () => {
    setIsOpen(false);

    if (didUserChatWithMe) {
      // User has chatted before - navigate to existing chat
      router.push(`/dashboard/teacher/messages?chatId=${userId}`);
    } else {
      // New chat - open compose modal
      if (post) {
        handleOpenModal(ComposeNewMessageModal, { post });
      } else {
        // Fallback: if no post data, just navigate (will create chat on first message)
        router.push(`/dashboard/teacher/messages?chatId=${userId}`);
      }
    }
  };

  const isLoading =
    isFollowingUserLoading || isUnfollowingUserLoading || isMutatingFavorite;

  if (isMobile) {
    // Mobile: Regular button with bottom sheet
    return (
      <>
        {/* Action Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="User actions"
        >
          <MoreVertical size={20} className="text-gray-600" />
        </motion.button>

        {/* Bottom Sheet */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/50 z-50"
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[60vh] overflow-y-auto"
              >
                <div className="p-6">
                  {/* Handle */}
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

                  {/* Header */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Actions for {userName}
                  </h3>

                  {/* Actions */}
                  <div className="space-y-2">
                    {/* Follow/Unfollow */}
                    <button
                      onClick={handleFollow}
                      disabled={isLoading}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus size={20} className="text-[#368FFF]" />
                          <span className="text-gray-900 font-medium">
                            Unfollow
                          </span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={20} className="text-gray-600" />
                          <span className="text-gray-900 font-medium">
                            Follow
                          </span>
                        </>
                      )}
                    </button>

                    {/* Chat */}
                    <button
                      onClick={handleChat}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <MessageSquare size={20} className="text-gray-600" />
                      <span className="text-gray-900 font-medium">Message</span>
                    </button>

                    {/* Favorite/Unfavorite */}
                    <button
                      onClick={handleFavoriteToggle}
                      disabled={isMutatingFavorite}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      {isFavorited ? (
                        <>
                          <HeartOff size={20} className="text-red-500" />
                          <span className="text-gray-900 font-medium">
                            Remove from Favorites
                          </span>
                        </>
                      ) : (
                        <>
                          <Heart size={20} className="text-gray-600" />
                          <span className="text-gray-900 font-medium">
                            Add to Favorites
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop: Dropdown menu
  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="User actions"
      >
        <MoreVertical size={20} className="text-gray-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
          >
            {/* Follow/Unfollow */}
            <button
              onClick={handleFollow}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isFollowing ? (
                <>
                  <UserMinus size={18} className="text-[#368FFF]" />
                  <span className="text-sm text-gray-900 font-medium">
                    Unfollow
                  </span>
                </>
              ) : (
                <>
                  <UserPlus size={18} className="text-gray-600" />
                  <span className="text-sm text-gray-900 font-medium">
                    Follow
                  </span>
                </>
              )}
            </button>

            {/* Chat */}
            <button
              onClick={handleChat}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
            >
              <MessageSquare size={18} className="text-gray-600" />
              <span className="text-sm text-gray-900 font-medium">Message</span>
            </button>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-1" />

            {/* Favorite/Unfavorite */}
            <button
              onClick={handleFavoriteToggle}
              disabled={isMutatingFavorite}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isFavorited ? (
                <>
                  <HeartOff size={18} className="text-red-500" />
                  <span className="text-sm text-gray-900 font-medium">
                    Remove from Favorites
                  </span>
                </>
              ) : (
                <>
                  <Heart size={18} className="text-gray-600" />
                  <span className="text-sm text-gray-900 font-medium">
                    Add to Favorites
                  </span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Modal for ComposeNewMessageModal */}
      {ModalComponent && (
        <ResponsiveModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalComponent {...modalProps} />
        </ResponsiveModal>
      )}
    </div>
  );
}
