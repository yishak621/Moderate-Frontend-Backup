import { Message } from "@/app/types/threads";
import { queryClient } from "@/lib/queryClient";
import {
  getMessages,
  getThreads,
  markMessageAsRead,
  sendMessageAPI,
} from "@/services/message.service";
import { useMutation, useQuery } from "@tanstack/react-query";

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
