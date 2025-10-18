import { getMessages, getThreads } from "@/services/message.service";
import { useQuery } from "@tanstack/react-query";

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
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false, // avoid redundant calls
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
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false, // avoid redundant calls
  });

  return {
    isMessagesLoading,
    isMessagesSuccess,
    messages,
  };
};
