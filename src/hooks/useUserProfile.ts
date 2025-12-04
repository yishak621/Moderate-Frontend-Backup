import { useQuery } from "@tanstack/react-query";
import { getUserProfile, UserProfileResponse } from "@/services/userProfile.service";

export const useUserProfile = (userId: string | null) => {
  const { data, isLoading, isError, error, isSuccess, refetch } = useQuery<UserProfileResponse>({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    profile: data?.user,
    stats: data?.stats,
    relationship: data?.relationship,
    isProfileLoading: isLoading,
    isProfileError: isError,
    profileError: error,
    isProfileSuccess: isSuccess,
    refetchProfile: refetch,
  };
};

