import { Message } from "@/app/types/threads";
import { queryClient } from "@/lib/queryClient";
import {
  getMessages,
  getThreads,
  markMessageAsRead,
  sendMessageAPI,
  createGroupChat,
  getAllConversations,
  getGroupMessages,
  addGroupMembers,
  removeGroupMember,
  leaveGroup,
  deleteDirectChat,
  getGroupMembers,
} from "@/services/message.service";
import {
  getBlockedUsers,
  getBlockStatus,
  blockUser,
  unblockUser,
} from "@/services/userBlock.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateGroupInput,
  AddMembersInput,
  GroupConversation,
} from "@/app/types/groupChat";

//-------------------------GET ALL THREADS
export const useThreads = (userId: string) => {
  const {
    isLoading: isThreadsLoading,
    isSuccess: isThreadsSuccess,
    data: threads,
  } = useQuery({
    queryKey: ["threads", userId],
    queryFn: () => getThreads(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // avoid redundant calls
    refetchOnReconnect: false, // avoid burst on reconnect
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    isThreadsLoading,
    isThreadsSuccess,
    threads,
  };
};

//--------------------------GET ALL USER MESSAGES FOR SPECFIC CONVERSATIONS
export const useGetMessages = (receiverUserId: string) => {
  const {
    isLoading: isMessagesLoading,
    isSuccess: isMessagesSuccess,
    data: messages,
  } = useQuery({
    queryKey: ["messages", receiverUserId],
    queryFn: () => getMessages(receiverUserId),
    enabled: !!receiverUserId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // avoid redundant calls
    refetchOnReconnect: false, // avoid burst on reconnect
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    isMessagesLoading,
    isMessagesSuccess,
    messages,
  };
};

//----------------------------MARK MESSAGE US READ

export const useMarkMessageAsRead = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (id: string) => markMessageAsRead(id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["messages"],
          exact: false,
        });
      },
    });

  return {
    markMessageAsRead: mutate,
    markMessageAsReadAsync: mutateAsync,
    data,
    ismarkMessageAsReadLoading: isPending,
    ismarkMessageAsReadSuccess: isSuccess,
    ismarkMessageAsReadError: isError,
    markMessageAsReadError: error,
  };
};

//----------------------------SEND MESSAGE API

export const useSendMessageAPI = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (message: Message) => sendMessageAPI(message),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["messages"],
          exact: false,
        });
      },
    });

  return {
    sendMessageAPI: mutate,
    sendMessageAPIAsync: mutateAsync,
    data,
    isSendMessageAPILoading: isPending,
    isSendMessageAPISuccess: isSuccess,
    isSendMessageAPIError: isError,
    sendMessageAPIError: error,
  };
};

//----------------------------GROUP CHAT HOOKS

// Create a group chat
export const useCreateGroupChat = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: CreateGroupInput) => createGroupChat(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        queryClient.invalidateQueries({ queryKey: ["threads"] });
      },
    });

  return {
    createGroupChat: mutate,
    createGroupChatAsync: mutateAsync,
    data,
    isCreatingGroup: isPending,
    isCreateGroupSuccess: isSuccess,
    isCreateGroupError: isError,
    createGroupError: error,
  };
};

// Get all conversations (direct + group)
export const useAllConversations = () => {
  const {
    isLoading,
    isSuccess,
    data,
    isError,
    error,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getAllConversations(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    conversations: data?.conversations || [],
    isConversationsLoading: isLoading,
    isConversationsSuccess: isSuccess,
    isConversationsError: isError,
    conversationsError: error,
  };
};

// Get group messages
export const useGroupMessages = (conversationId: string) => {
  const {
    isLoading,
    isSuccess,
    data,
    isError,
    error,
  } = useQuery({
    queryKey: ["groupMessages", conversationId],
    queryFn: () => getGroupMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    messages: data?.messages || [],
    isGroupMessagesLoading: isLoading,
    isGroupMessagesSuccess: isSuccess,
    isGroupMessagesError: isError,
    groupMessagesError: error,
  };
};

// Add members to group
export const useAddGroupMembers = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: ({
        conversationId,
        data: membersData,
      }: {
        conversationId: string;
        data: AddMembersInput;
      }) => addGroupMembers(conversationId, membersData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    });

  return {
    addGroupMembers: mutate,
    addGroupMembersAsync: mutateAsync,
    data,
    isAddingMembers: isPending,
    isAddMembersSuccess: isSuccess,
    isAddMembersError: isError,
    addMembersError: error,
  };
};

// Remove member from group
export const useRemoveGroupMember = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: ({
        conversationId,
        userId,
      }: {
        conversationId: string;
        userId: string;
      }) => removeGroupMember(conversationId, userId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    });

  return {
    removeGroupMember: mutate,
    removeGroupMemberAsync: mutateAsync,
    data,
    isRemovingMember: isPending,
    isRemoveMemberSuccess: isSuccess,
    isRemoveMemberError: isError,
    removeMemberError: error,
  };
};

// Leave group (self-removal)
export const useLeaveGroup = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (conversationId: string) => leaveGroup(conversationId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        queryClient.invalidateQueries({ queryKey: ["groupMessages"] });
      },
    });

  return {
    leaveGroup: mutate,
    leaveGroupAsync: mutateAsync,
    data,
    isLeavingGroup: isPending,
    isLeaveGroupSuccess: isSuccess,
    isLeaveGroupError: isError,
    leaveGroupError: error,
  };
};

// Delete direct chat with a user
export const useDeleteDirectChat = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (otherUserId: string) => deleteDirectChat(otherUserId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["threads"] });
        queryClient.invalidateQueries({ queryKey: ["messages"] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    });

  return {
    deleteDirectChat: mutate,
    deleteDirectChatAsync: mutateAsync,
    data,
    isDeletingChat: isPending,
    isDeleteChatSuccess: isSuccess,
    isDeleteChatError: isError,
    deleteChatError: error,
  };
};

// Get list of blocked users
export const useBlockedUsers = () => {
  const { isLoading, isSuccess, data, isError, error } = useQuery({
    queryKey: ["blocked-users"],
    queryFn: () => getBlockedUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    blockedUsers: data?.blockedUsers || [],
    isBlockedUsersLoading: isLoading,
    isBlockedUsersSuccess: isSuccess,
    isBlockedUsersError: isError,
    blockedUsersError: error,
  };
};

// Check block status with a user
export const useBlockStatus = (userId: string) => {
  const { isLoading, isSuccess, data, isError, error, refetch } = useQuery({
    queryKey: ["block-status", userId],
    queryFn: () => getBlockStatus(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    blockStatus: data,
    isBlockStatusLoading: isLoading,
    isBlockStatusSuccess: isSuccess,
    isBlockStatusError: isError,
    blockStatusError: error,
    refetchBlockStatus: refetch,
  };
};

// Block a user
export const useBlockUser = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: ({ userId, reason }: { userId: string; reason?: string }) =>
        blockUser(userId, reason),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
        queryClient.invalidateQueries({ queryKey: ["block-status"] });
        queryClient.invalidateQueries({ queryKey: ["threads"] });
      },
    });

  return {
    blockUser: mutate,
    blockUserAsync: mutateAsync,
    data,
    isBlockingUser: isPending,
    isBlockUserSuccess: isSuccess,
    isBlockUserError: isError,
    blockUserError: error,
  };
};

// Unblock a user
export const useUnblockUser = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (userId: string) => unblockUser(userId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
        queryClient.invalidateQueries({ queryKey: ["block-status"] });
        queryClient.invalidateQueries({ queryKey: ["threads"] });
      },
    });

  return {
    unblockUser: mutate,
    unblockUserAsync: mutateAsync,
    data,
    isUnblockingUser: isPending,
    isUnblockUserSuccess: isSuccess,
    isUnblockUserError: isError,
    unblockUserError: error,
  };
};

// Get group members
export const useGetGroupMembers = (conversationId: string) => {
  const { isLoading, isSuccess, data, isError, error, refetch } = useQuery({
    queryKey: ["group-members", conversationId],
    queryFn: () => getGroupMembers(conversationId),
    enabled: !!conversationId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    groupData: data,
    members: data?.members || [],
    memberCount: data?.memberCount || 0,
    groupName: data?.groupName || "",
    ownerId: data?.ownerId || "",
    isOwner: data?.isOwner || false, // From API response
    isGroupMembersLoading: isLoading,
    isGroupMembersSuccess: isSuccess,
    isGroupMembersError: isError,
    groupMembersError: error,
    refetchGroupMembers: refetch,
  };
};
