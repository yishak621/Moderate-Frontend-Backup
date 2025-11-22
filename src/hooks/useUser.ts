import { SettingItem, User } from "@/app/types/user";
import { queryClient } from "@/lib/queryClient";
import { useGradeEditStore } from "@/store/gradeEditStore";
import {
  GradingTemplate,
  CreateGradingTemplateInput,
  UpdateGradingTemplateInput,
} from "@/types/gradingTemplate";
import {
  saveGradingTemplate,
  getGradingTemplates,
  getGradingTemplateById,
  updateGradingTemplate,
  deleteGradingTemplate,
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
  deleteUserGrade,
  followUser,
  getFollowingUsers,
  getFollowers,
  unfollowUser,
} from "@/services/user.service";
import { Grade, GradeData } from "@/types/Post";
import { PostCreateInput } from "@/types/postAttributes";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
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
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ["userPostFeeds"],
    queryFn: ({ pageParam = 1 }) => userPostFeeds(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.meta?.page ?? 1;
      const lastPageNumber = lastPage?.meta?.lastPage ?? 1;
      return currentPage < lastPageNumber ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  const pages = data?.pages ?? [];
  const combinedPosts = pages.flatMap((page: any) => page?.posts || []) ?? [];
  const latestMeta = pages.length > 0 ? pages[pages.length - 1]?.meta : null;
  const status = pages.length > 0 ? pages[0]?.status : null;

  return {
    userPostFeedsData: {
      status,
      meta: latestMeta,
      posts: combinedPosts,
      pages,
    },
    isUserPostFeedsDataLoading: isLoading,
    isUserPostFeedsDataSuccess: isSuccess,
    isUserPostFeedsDataError: isError,
    isUserPostFeedsError: error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchingInitial: isFetching && !isFetchingNextPage,
  };
}

//------------------- USER MY POSTS

export function useUserMyPostsFeeds() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ["userMyPostsFeeds"],
    queryFn: ({ pageParam = 1 }) => userMyPostsFeeds(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.meta?.page ?? 1;
      const lastPageNumber = lastPage?.meta?.lastPage ?? 1;
      return currentPage < lastPageNumber ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  const pages = data?.pages ?? [];
  const combinedPosts = pages.flatMap((page: any) => page?.posts || []) ?? [];
  const latestMeta = pages.length > 0 ? pages[pages.length - 1]?.meta : null;
  const status = pages.length > 0 ? pages[0]?.status : null;

  return {
    userMyPostFeedsData: {
      status,
      meta: latestMeta,
      posts: combinedPosts,
      pages,
    },
    isUserMyPostFeedsDataLoading: isLoading,
    isUserMyPostFeedsDataSuccess: isSuccess,
    isUserMyPostFeedsDataError: isError,
    isUserMyPostFeedsError: error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchingInitial: isFetching && !isFetchingNextPage,
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
        queryClient.invalidateQueries({
          queryKey: ["userSinglePostData"],
          exact: false,
        });

        queryClient.invalidateQueries({
          queryKey: ["userPostFeeds"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["favoritePosts"],
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
        queryClient.invalidateQueries({
          queryKey: ["userMyPostsFeeds"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["userSinglePostData"],
          exact: false,
        });

        queryClient.invalidateQueries({
          queryKey: ["userPostFeeds"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["favoritePosts"],
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
          queryKey: ["userSinglePostData"],
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
        queryClient.invalidateQueries({
          queryKey: ["userMyPostsFeeds"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["userSinglePostData"],
          exact: false,
        });

        queryClient.invalidateQueries({
          queryKey: ["userPostFeeds"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["favoritePosts"],
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
        queryClient.invalidateQueries({
          queryKey: ["userMyPostsFeeds"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["userSinglePostData"],
          exact: false,
        });

        queryClient.invalidateQueries({
          queryKey: ["userPostFeeds"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["favoritePosts"],
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
  const { clearEditingGrade } = useGradeEditStore();
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
    onSuccess: (data, variables) => {
      toast.success("Grade saved successfully!");
      // Clear edit mode after successful save
      clearEditingGrade(variables.postId);
      // Invalidate both single post and post feeds to refresh UI
      queryClient.invalidateQueries({
        queryKey: ["userSinglePostData"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["userPostFeeds"],
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

//--------------------DELETE USER GRADE
export const useUserDeleteGrade = () => {
  const { clearEditingGrade } = useGradeEditStore();
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: ({
        postId,
        gradeId,
        commentId,
      }: {
        postId: string;
        gradeId: string;
        commentId: string;
      }) => deleteUserGrade(postId, gradeId, commentId),
      onSuccess: (data, variables) => {
        toast.success("Grade deleted successfully!");
        // Clear edit mode after successful deletion
        clearEditingGrade(variables.postId);
        queryClient.invalidateQueries({
          queryKey: ["userSinglePostData"],
          exact: false,
        });
      },
    });

  return {
    deleteGrade: mutate,
    deleteGradeAsync: mutateAsync,
    data,
    isDeletingGradeLoading: isPending,
    isDeletingGradeSuccess: isSuccess,
    isDeletingGradeError: isError,
    deletingGradeError: error,
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

//--------------------GRADING TEMPLATE HOOKS

export const useSaveGradingTemplate = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: CreateGradingTemplateInput) =>
        saveGradingTemplate(data),
      onSuccess: () => {
        toast.success("Template saved successfully!");
        queryClient.invalidateQueries({
          queryKey: ["gradingTemplates"],
          exact: false,
        });
      },
    });

  return {
    saveTemplate: mutate,
    saveTemplateAsync: mutateAsync,
    savedTemplateData: data,
    isSavingTemplateLoading: isPending,
    isSavingTemplateSuccess: isSuccess,
    isSavingTemplateError: isError,
    savingTemplateError: error,
  };
};

export const useGradingTemplates = () => {
  const { data, isLoading, isError, error, isSuccess, refetch } = useQuery({
    queryKey: ["gradingTemplates"],
    queryFn: async () => {
      const response = await getGradingTemplates();
      let templates: any[] = [];
      if (response?.json?.templates) {
        templates = response.json.templates;
      } else if (response?.templates) {
        templates = response.templates;
      } else if (Array.isArray(response)) {
        templates = response;
      }

      return templates.map((template: any) => ({
        ...template,
        gradingType: template.type || template.gradingType,
      }));
    },
  });

  return {
    gradingTemplates: (data as GradingTemplate[]) || [],
    isGradingTemplatesLoading: isLoading,
    isGradingTemplatesError: isError,
    gradingTemplatesError: error,
    isGradingTemplatesSuccess: isSuccess,
    refetchGradingTemplates: refetch,
  };
};

export const useGradingTemplateById = (templateId: string | null) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["gradingTemplate", templateId],
    queryFn: async () => {
      if (!templateId) return null;
      const response = await getGradingTemplateById(templateId);
      if (response?.json?.template) {
        return response.json.template;
      }
      if (response?.template) {
        return response.template;
      }
      return response;
    },
    enabled: !!templateId,
  });

  return {
    gradingTemplate: data as GradingTemplate | null,
    isGradingTemplateLoading: isLoading,
    isGradingTemplateError: isError,
    gradingTemplateError: error,
    isGradingTemplateSuccess: isSuccess,
  };
};

export const useUpdateGradingTemplate = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: ({
        templateId,
        data,
      }: {
        templateId: string;
        data: UpdateGradingTemplateInput;
      }) => updateGradingTemplate(templateId, data),
      onSuccess: () => {
        toast.success("Template updated successfully!");
        queryClient.invalidateQueries({
          queryKey: ["gradingTemplates"],
          exact: false,
        });
      },
    });

  return {
    updateTemplate: mutate,
    updateTemplateAsync: mutateAsync,
    updatedTemplateData: data,
    isUpdatingTemplateLoading: isPending,
    isUpdatingTemplateSuccess: isSuccess,
    isUpdatingTemplateError: isError,
    updatingTemplateError: error,
  };
};

export const useDeleteGradingTemplate = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (templateId: string) => deleteGradingTemplate(templateId),
      onSuccess: () => {
        toast.success("Template deleted successfully!");
        queryClient.invalidateQueries({
          queryKey: ["gradingTemplates"],
          exact: false,
        });
      },
    });

  return {
    deleteTemplate: mutate,
    deleteTemplateAsync: mutateAsync,
    deletedTemplateData: data,
    isDeletingTemplateLoading: isPending,
    isDeletingTemplateSuccess: isSuccess,
    isDeletingTemplateError: isError,
    deletingTemplateError: error,
  };
};

//--------------------FOLLOW USER
export const useFollowUser = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (userId: string) => followUser(userId),
      onSuccess: () => {
        toast.success("User followed successfully!");
        queryClient.invalidateQueries({
          queryKey: ["followingUsers"],
          exact: false,
        });
      },
      onError: (error) => {
        toast.error("Failed to follow user!");
      },
    });

  return {
    followUser: mutate,
    followUserAsync: mutateAsync,
    data,
    isFollowingUserLoading: isPending,
    isFollowingUserSuccess: isSuccess,
    isFollowingUserError: isError,
    followingUserError: error,
  };
};

//--------------------UNFOLLOW USER
export const useUnfollowUser = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (userId: string) => unfollowUser(userId),
      onSuccess: () => {
        toast.success("User unfollowed successfully!");
        queryClient.invalidateQueries({
          queryKey: ["followingUsers"],
          exact: false,
        });
      },
      onError: (error) => {
        toast.error("Failed to unfollow user!");
      },
    });

  return {
    unfollowUser: mutate,
    unfollowUserAsync: mutateAsync,
    data,
    isUnfollowingUserLoading: isPending,
    isUnfollowingUserSuccess: isSuccess,
    isUnfollowingUserError: isError,
    unfollowingUserError: error,
  };
};
//--------------------GET FOLLOWING USERS
export const useGetFollowingUsers = () => {
  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["followingUsers"],
    queryFn: getFollowingUsers,
    staleTime: 5 * 60 * 1000,
  });

  return {
    followingUsers: data,
    isFollowingUsersLoading: isPending,
    isFollowingUsersSuccess: isSuccess,
    isFollowingUsersError: isError,
    followingUsersError: error,
  };
};

//--------------------GET FOLLOWERS
export const useGetFollowers = () => {
  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["followers"],
    queryFn: getFollowers,
    staleTime: 5 * 60 * 1000,
  });

  return {
    followers: data,
    isFollowersLoading: isPending,
    isFollowersSuccess: isSuccess,
    isFollowersError: isError,
    followersError: error,
  };
};
