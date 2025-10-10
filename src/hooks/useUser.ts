import { User } from "@/app/types/user";
import { queryClient } from "@/lib/queryClient";
import {
  updateUserData,
  userData,
  userOverviewStats,
  userPostFeeds,
} from "@/services/user.service";
import { useMutation, useQuery } from "@tanstack/react-query";

//--------------------GET USER DATA
export function useUserData() {
  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["me"],
    queryFn: userData,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
  };
}

//------------------- USER OVERVIEW STATS

export function useUserOverviewStatsData() {
  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["userOverviewStat"],
    queryFn: userOverviewStats,
    staleTime: 5 * 60 * 1000,
  });

  return {
    userOverviewStatsData: data,
    isUserOverviewStatsDataLoading: isPending,
    isUserOverviewStatsDataSuccess: isSuccess,
    isUserOverviewStatsDataError: isError,
    isUserOverviewStatsError: error,
  };
}

//------------------- USER POST FEEDS

export function useUserPostFeeds() {
  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["userPostFeeds"],
    queryFn: userPostFeeds,
    staleTime: 5 * 60 * 1000,
  });

  return {
    userPostFeedsData: data,
    isUserPostFeedsDataLoading: isPending,
    isUserPostFeedsDataSuccess: isSuccess,
    isUserPostFeedsDataError: isError,
    isUserPostFeedsError: error,
  };
}

//--------------------UPDATE USER DATA
export const useUpdateUserData = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: User) => updateUserData(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["me"],
          exact: false,
        });
      },
    });

  return {
    editUser: mutate,
    editUserAsync: mutateAsync,
    data,
    isEditingUserLoading: isPending,
    isEditingUserSuccess: isSuccess,
    isEditingUserError: isError,
    editingUserError: error,
  };
};
