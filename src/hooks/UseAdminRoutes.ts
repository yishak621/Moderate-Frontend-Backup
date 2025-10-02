//AdminOverview
import { getAllUsers } from "@/services/admin.service";
import { AdminOverview } from "@/services/user.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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

export function useAdminUsersData(
  page: number,
  curricular?: string,
  search?: string
) {
  const queryClient = useQueryClient();

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search || "");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search || ""), 2000);
    return () => clearTimeout(handler);
  }, [search]);

  const query = useQuery({
    queryKey: ["allUsers", page, curricular, debouncedSearch],
    queryFn: () => getAllUsers(page, curricular || "", debouncedSearch),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  // Prefetch next and previous pages
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["allUsers", page + 1, curricular, debouncedSearch],
      queryFn: () => getAllUsers(page + 1, curricular || "", debouncedSearch),
    });

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["allUsers", page - 1, curricular, debouncedSearch],
        queryFn: () => getAllUsers(page - 1, curricular || "", debouncedSearch),
      });
    }
  }, [page, curricular, debouncedSearch, queryClient]);

  return {
    allUsers: query.data,
    isUsersLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error,
  };
}