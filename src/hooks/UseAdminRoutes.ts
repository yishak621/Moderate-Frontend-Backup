//AdminOverview
import { User } from "@/app/types/user";
import {
  AdminOverview,
  createNewCurricularArea,
  createNewUser,
  deleteCurricularArea,
  deleteUserData,
  editUserData,
  getAllCurricularAreas,
  getAllUsers,
  updateCurricularArea,
  viewUserData,
} from "@/services/admin.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { SignupFormDataTypes } from "@/types/authData.type";
import { Curricular } from "@/app/types/curricular";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"], exact: false });
    },
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

//ADMIN CREATE NEW USER
export function useAdminUserCreateData() {
  const {
    mutate,
    mutateAsync,
    data: createdNewUserData,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: SignupFormDataTypes) => createNewUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"], exact: false });
    },
  });

  return {
    createNewUserData: mutate,
    createNewUserDataAsync: mutateAsync,
    data: createdNewUserData,
    isCreatingNewUserDataLoading: isPending,
    isCreatingNewUserDataSuccess: isSuccess,
    isCreatingNewUserDataError: isError,
    creatingNewUserDataError: error,
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

// ADMIN CURRICULAR AREAS DATA
export function useAdminCurricularAreasData(page: number) {
  const query = useQuery({
    queryKey: ["allCurricularAreas", page],
    queryFn: () => getAllCurricularAreas(page),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  // Prefetch next and previous pages
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["allCurricularAreas", page + 1],
      queryFn: () => getAllCurricularAreas(page + 1),
    });

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["allCurricularAreas", page - 1],
        queryFn: () => getAllCurricularAreas(page - 1),
      });
    }
  }, [page]);

  return {
    allCurricularAreas: query.data,
    isCurricularAreasLoading: query.isPending,
    isCurricularAreasSuccess: query.isSuccess,
    isCurricularAreasError: query.isError,
    curricularAreasError: query.error,
  };
}

//ADMIN CURRICULAR AREA CREATE DATA
export const useAdminCurricularAreaCreateData = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: Curricular) => createNewCurricularArea(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allCurricularAreas"],
          exact: false,
        });
      },
    });

  return {
    createCurricularArea: mutate,
    createCurricularAreaAsync: mutateAsync,
    data,
    isCreatingCurricularAreaLoading: isPending,
    isCreatingCurricularAreaSuccess: isSuccess,
    isCreatingCurricularAreaError: isError,
    creatingCurricularAreaError: error,
  };
};

//ADMIN CURRICULAR AREA EDIT DATA
export const useAdminCurricularAreaEditData = (id: string) => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: Curricular) => updateCurricularArea(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allCurricularAreas"],
          exact: false,
        });
      },
    });

  return {
    editCurricularArea: mutate,
    editCurricularAreaAsync: mutateAsync,
    data,
    isEditingCurricularAreaLoading: isPending,
    isEditingCurricularAreaSuccess: isSuccess,
    isEditingCurricularAreaError: isError,
    editingCurricularAreaError: error,
  };
};

//ADMIN USER DELETE DATA
export function useAdminCurricularAreaDeleteData(id: string) {
  const {
    mutate,
    mutateAsync,
    data: deletedData,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: () => deleteCurricularArea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allCurricularAreas"],
        exact: false,
      });
    },
  });

  return {
    deleteCurricularData: mutate,
    deleteCurricularDataAsync: mutateAsync,
    data: deletedData,
    isDeletingCurricularDataLoading: isPending,
    isDeletingCurricularDataSuccess: isSuccess,
    isDeletingCurricularDataError: isError,
    deletingCurricularDataError: error,
  };
}
