import { SettingItem, User } from "@/app/types/user";
import { queryClient } from "@/lib/queryClient";
import {
  deleteFileApi,
  deleteProfilePicture,
  deleteAccount,
  getAllAnnouncements,
  saveUserGrade,
  saveUserSettings,
  updateUserData,
  uploadFileApi,
  uploadProfilePicture,
  userCreatePost,
  userData,
  userMyPostsFeeds,
  userOverviewStats,
  userPostFeeds,
  userSinglePostData,
  updateUserPost,
  deleteUserPost,
  addToFavorites,
  removeFromFavorites,
  getFavoritePosts,
} from "@/services/user.service";
import { Grade, GradeData } from "@/types/Post";
import { PostCreateInput } from "@/types/postAttributes";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

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

//------------------- USER MY POSTS

export function useUserMyPostsFeeds() {
  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["userMyPostsFeeds"],
    queryFn: userMyPostsFeeds,
    staleTime: 5 * 60 * 1000,
  });

  return {
    userMyPostFeedsData: data,
    isUserMyPostFeedsDataLoading: isPending,
    isUserMyPostFeedsDataSuccess: isSuccess,
    isUserMyPostFeedsDataError: isError,
    isUserMyPostFeedsError: error,
  };
}

//------------------- USER SINGLE  POST DATA

export function useUserSinglePostData(postId: string) {
  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["userSinglePostData", postId],
    queryFn: () => userSinglePostData(postId),
    staleTime: 5 * 60 * 1000,
    enabled: !!postId,
  });

  return {
    userSinglePostData: data,
    isUserSinglePostDataLoading: isPending,
    isUserSinglePostDataSuccess: isSuccess,
    isUserSinglePostDataError: isError,
    isUserSinglePostError: error,
  };
}

//--------------------USER CREATE POST
export const useUserCreatePost = (domainId: string | boolean) => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: PostCreateInput) => userCreatePost(data, domainId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["userMyPostsFeeds"],
          exact: false,
        });
      },
    });

  return {
    createPost: mutate,
    createPostAsync: mutateAsync,
    data,

    isCreatingPostLoading: isPending,
    isCreatingPostSuccess: isSuccess,
    isCreatingPostError: isError,
    creatingPostError: error,
  };
};

//--------------------USER UPDATE POST
export const useUserUpdatePost = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: ({
        postId,
        data,
      }: {
        postId: string;
        data: PostCreateInput;
      }) => updateUserPost(postId, data),
      onSuccess: () => {
        // Invalidate user posts list
        queryClient.invalidateQueries({
          queryKey: ["userMyPostsFeeds"],
          exact: false,
        });
        // Invalidate all single post queries (for any postId)
        queryClient.invalidateQueries({
          queryKey: ["userSinglePostData"],
          exact: false,
        });
      },
    });

  return {
    updatePost: mutate,
    updatePostAsync: mutateAsync,
    data,
    isUpdatingPostLoading: isPending,
    isUpdatingPostSuccess: isSuccess,
    isUpdatingPostError: isError,
    updatingPostError: error,
  };
};

//--------------------USER DELETE POST

export const useUserDeletePost = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (postId: string) => deleteUserPost(postId),
      onSuccess: () => {
        toast.success("Post deleted successfully!");
        queryClient.invalidateQueries({
          queryKey: ["userMyPostsFeeds"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["userPostFeeds"],
          exact: false,
        });
      },
    });

  return {
    deletePost: mutate,
    deletePostAsync: mutateAsync,
    data,
    isDeletingPostLoading: isPending,
    isDeletingPostSuccess: isSuccess,
    isDeletingPostError: isError,
    deletingPostError: error,
  };
};

//--------------------ADD TO FAVORITES
export const useAddToFavorites = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (postId: string) => addToFavorites(postId),
      onSuccess: () => {
        toast.success("Added to favorites!");
        // Refetch immediately to update UI
        queryClient.refetchQueries({
          queryKey: ["favoritePosts"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["userPostFeeds"],
          exact: false,
        });
      },
    });

  return {
    addToFavorites: mutate,
    addToFavoritesAsync: mutateAsync,
    data,
    isAddingToFavoritesLoading: isPending,
    isAddingToFavoritesSuccess: isSuccess,
    isAddingToFavoritesError: isError,
    addingToFavoritesError: error,
  };
};

//--------------------REMOVE FROM FAVORITES
export const useRemoveFromFavorites = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (postId: string) => removeFromFavorites(postId),
      onSuccess: () => {
        toast.success("Removed from favorites!");
        // Refetch immediately to update UI
        queryClient.refetchQueries({
          queryKey: ["favoritePosts"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["userPostFeeds"],
          exact: false,
        });
      },
    });

  return {
    removeFromFavorites: mutate,
    removeFromFavoritesAsync: mutateAsync,
    data,
    isRemovingFromFavoritesLoading: isPending,
    isRemovingFromFavoritesSuccess: isSuccess,
    isRemovingFromFavoritesError: isError,
    removingFromFavoritesError: error,
  };
};

//--------------------GET FAVORITE POSTS
export function useFavoritePosts() {
  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["favoritePosts"],
    queryFn: getFavoritePosts,
    staleTime: 5 * 60 * 1000,
  });

  return {
    favoritePostsData: data,
    isFavoritePostsDataLoading: isPending,
    isFavoritePostsDataSuccess: isSuccess,
    isFavoritePostsDataError: isError,
    isFavoritePostsError: error,
  };
}

//--------------------USER UPLOAD FILE
export const useUserUploadFile = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: File) => uploadFileApi(data),
      onSuccess: () => {
        toast.success("File Uploaded Successfully!");
      },
    });

  return {
    uploadFile: mutate,
    uploadFileAsync: mutateAsync,
    data,
    isUploadingFileLoading: isPending,
    isUploadingFileSuccess: isSuccess,
    isUploadingFileError: isError,
    uploadingFileError: error,
  };
};

//--------------------USER REMOVE FILE
export const useUserRemoveUploadedFile = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (fileId: string) => deleteFileApi(fileId),
      onSuccess: () => {
        toast.success("File Deleted Successfully!");
      },
    });

  return {
    deleteFile: mutate,
    deleteFileAsync: mutateAsync,
    data,
    isDeletingFileLoading: isPending,
    isDeletingFileSuccess: isSuccess,
    isDeletingFileError: isError,
    deletingFileError: error,
  };
};

//--------------------USER SAVE GRADE
export const useUserSaveGrade = () => {
  const {
    mutate,
    mutateAsync,
    data: savedGradeData,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: ({
      postId,
      gradeData,
    }: {
      postId: string;
      gradeData: GradeData;
    }) => saveUserGrade(postId, gradeData),
    onSuccess: () => {
      toast.success("Grade saved successfully!");
      queryClient.invalidateQueries({
        queryKey: ["userSinglePostData"],
        exact: false,
      });
    },
  });

  return {
    saveGrade: mutate,
    saveGradeAsync: mutateAsync,
    savedGradeData,
    isSavingGradeLoading: isPending,
    isSavingGradeSuccess: isSuccess,
    isSavingGradeError: isError,
    savingGradeError: error,
  };
};

//--------------------GET USER DATA
export function useAllAnnouncementsData() {
  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["AllAnnouncements"],
    queryFn: getAllAnnouncements,
    staleTime: 1 * 60 * 1000,
  });

  return {
    AllAnnouncements: data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
  };
}

//--------------------USER REMOVE FILE
export const useUserSaveSettings = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: { settings: SettingItem }) => saveUserSettings(data),
      onSuccess: () => {
        toast.success("Settings saved successfully!");
      },
    });
  return {
    saveSettings: mutate,
    saveSettingsAsync: mutateAsync,
    data,
    isSavingSettingsLoading: isPending,
    isSavingSettingsSuccess: isSuccess,
    isSavingSettingsError: isError,
    savingSettingError: error,
  };
};

//--------------------UPDATE PASSWORD
export const useUpdatePassword = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: { password: string }) => updateUserData(data),
      onSuccess: () => {
        toast.success("Password updated successfully!");
        queryClient.invalidateQueries({
          queryKey: ["me"],
          exact: false,
        });
      },
    });

  return {
    updatePassword: mutate,
    updatePasswordAsync: mutateAsync,
    data,
    isUpdatingPasswordLoading: isPending,
    isUpdatingPasswordSuccess: isSuccess,
    isUpdatingPasswordError: isError,
    updatingPasswordError: error,
  };
};

//--------------------UPLOAD PROFILE PICTURE
export const useUploadProfilePicture = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (file: File) => uploadProfilePicture(file),
      onSuccess: () => {
        toast.success("Profile picture uploaded successfully!");
        queryClient.invalidateQueries({
          queryKey: ["me"],
          exact: false,
        });
      },
    });

  return {
    uploadProfilePicture: mutate,
    uploadProfilePictureAsync: mutateAsync,
    data,
    isUploadingProfilePictureLoading: isPending,
    isUploadingProfilePictureSuccess: isSuccess,
    isUploadingProfilePictureError: isError,
    uploadingProfilePictureError: error,
  };
};

//--------------------DELETE PROFILE PICTURE
export const useDeleteProfilePicture = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: () => deleteProfilePicture(),
      onSuccess: () => {
        toast.success("Profile picture deleted successfully!");
        queryClient.invalidateQueries({
          queryKey: ["me"],
          exact: false,
        });
      },
    });

  return {
    deleteProfilePicture: mutate,
    deleteProfilePictureAsync: mutateAsync,
    data,
    isDeletingProfilePictureLoading: isPending,
    isDeletingProfilePictureSuccess: isSuccess,
    isDeletingProfilePictureError: isError,
    deletingProfilePictureError: error,
  };
};

//--------------------DELETE ACCOUNT
export const useDeleteAccount = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (password?: string) => deleteAccount(password),
      onSuccess: () => {
        toast.success("Account deleted successfully!");
        queryClient.clear();
      },
    });

  return {
    deleteAccount: mutate,
    deleteAccountAsync: mutateAsync,
    data,
    isDeletingAccountLoading: isPending,
    isDeletingAccountSuccess: isSuccess,
    isDeletingAccountError: isError,
    deletingAccountError: error,
  };
};
