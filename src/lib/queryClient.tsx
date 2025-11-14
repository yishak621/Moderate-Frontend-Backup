import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable to prevent burst on focus
      refetchOnReconnect: false, // Disable to prevent burst on reconnect
      refetchOnMount: true, // Only refetch when component mounts
      staleTime: 2 * 60 * 1000, // 2 minutes - data is fresh for 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache (formerly cacheTime)
      retry: 2, // Retry 2 times on failure
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff with max 30s
    },
  },
});
