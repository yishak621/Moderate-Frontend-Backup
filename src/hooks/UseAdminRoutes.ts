//AdminOverview
import { AdminOverview } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

export function useAdminOverviewData() {
  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["overview"],
    queryFn: AdminOverview,
    staleTime: 5 * 60 * 1000,
  });

  return {
    overview: data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
  };
}
