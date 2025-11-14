import { useQuery } from "@tanstack/react-query";
import { getThreads } from "@/services/message.service";
import { Threads } from "@/app/types/threads";

/**
 * Hook to get total unread message count from all threads
 * Note: This is primarily updated via Socket.IO, so we don't need aggressive polling
 */
export function useUnreadMessages(userId?: string) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["threads", userId],
    queryFn: () => getThreads(userId!),
    enabled: !!userId,
    staleTime: 120000, // 2 minutes - data is fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache
    refetchInterval: false, // Disable polling - rely on Socket.IO for real-time updates
    refetchOnWindowFocus: false, // Disable to prevent burst on focus
    refetchOnReconnect: false, // Disable to prevent burst on reconnect
    refetchOnMount: true, // Only refetch when component mounts
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Calculate total unread count from all threads
  const totalUnreadCount = data?.data
    ? (data.data as Threads[]).reduce(
        (sum: number, thread: Threads) => sum + (thread.unreadCount || 0),
        0
      )
    : 0;

  return {
    totalUnreadCount,
    isLoading,
    isSuccess,
    threads: data?.data || [],
  };
}

