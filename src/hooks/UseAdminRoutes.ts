//AdminOverview
import { User } from "@/app/types/user";
import {
  AdminOverview,
  deleteUserData,
  editUserData,
  getAllUsers,
  viewUserData,
} from "@/services/admin.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryClient } from "@/lib/queryClient";

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

//ADMIN USER VIEW DATA
export function useAdminUserData(id: string) {
  const query = useQuery({
    queryKey: ["viewuserData", id],
    queryFn: () => viewUserData(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  return {
    userData: query.data,
    isUserDataLoading: query.isPending,
    isUserDataSuccess: query.isSuccess,
    isUserDataError: query.isError,
    userDataError: query.error,
  };
}

//ADMIN USER EDIT DATA
export function useAdminUserEditData(id: string) {
  const {
    mutate,
    mutateAsync,
    data: editedData,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: User) => editUserData(id, data),
  });

  return {
    editUserData: mutate,
    editUserDataAsync: mutateAsync,
    data: editedData,
    isEditingDataLoading: isPending,
    isEditingDataSuccess: isSuccess,
    isEditingDataError: isError,
    editingDataError: error,
  };
}

//ADMIN USER DELETE DATA
export function useAdminUserDeleteData(id: string) {
  const {
    mutate,
    mutateAsync,
    data: deletedData,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: () => deleteUserData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"], exact: false });
    },
  });

  return {
    deleteUserData: mutate,
    deleteUserDataAsync: mutateAsync,
    data: deletedData,
    isDeletingUserDataLoading: isPending,
    isDeletingUserDataSuccess: isSuccess,
    isDeletingUserDataError: isError,
    deletingUserDataError: error,
  };
}
