import { User } from "@/app/types/user";
import { queryClient } from "@/lib/queryClient";
import {
  deleteFileApi,
  saveUserGrade,
  updateUserData,
  uploadFileApi,
  userCreatePost,
  userData,
  userOverviewStats,
  userPostFeeds,
  userSinglePostData,
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
    queryFn: userPostFeeds,
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
    queryKey: ["userSinglePostData"],
    queryFn: () => userSinglePostData(postId),
    staleTime: 5 * 60 * 1000,
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
