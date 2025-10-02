//AdminOverview
import { getAllUsers } from "@/services/admin.service";
import { AdminOverview } from "@/services/user.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

//ADMIN OVERVIEW STAT DATA
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

//ADMIN USERS DATA

export function useAdminUsersData(page: number) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["allUsers", page],
    queryFn: () => getAllUsers(page),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  // Prefetch next page
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["allUsers", page + 1],
      queryFn: () => getAllUsers(page + 1),
    });

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["allUsers", page - 1],
        queryFn: () => getAllUsers(page - 1),
      });
    }
  }, [page, queryClient]);

  return {
    allUsers: query.data,
    isUsersLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error,
  };
}
