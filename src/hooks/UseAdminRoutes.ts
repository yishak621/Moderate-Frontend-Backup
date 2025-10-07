//AdminOverview
import { User } from "@/app/types/user";
import {
  AdminOverview,
  createNewAnnouncement,
  createNewCurricularArea,
  createNewEmailDomain,
  createNewUser,
  deleteAnnouncment,
  deleteCurricularArea,
  deleteEmailDomain,
  deleteUserData,
  editUserData,
  getAllAnnouncements,
  getAllCurricularAreas,
  getAllEmailDomains,
  getAllSiteSettings,
  getAllUsers,
  updateAnnouncment,
  updateCurricularArea,
  updateEmailDomain,
  viewUserData,
} from "@/services/admin.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { SignupFormDataTypes } from "@/types/authData.type";
import { Curricular } from "@/app/types/curricular";
import { AllowedEmailDomainAttributes } from "@/types/typeLog";
import { Announcement } from "@/app/types/announcement";

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
    const handler = setTimeout(() => setDebouncedSearch(search || ""), 1000);
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

// ADMIN CURRICULAR AREAS DATA
export function useAdminEmailDomainData(page: number) {
  const query = useQuery({
    queryKey: ["allEmailDomains", page],
    queryFn: () => getAllEmailDomains(page),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  // Prefetch next and previous pages
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["allEmailDomains", page + 1],
      queryFn: () => getAllEmailDomains(page + 1),
    });

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["allEmailDomains", page - 1],
        queryFn: () => getAllEmailDomains(page - 1),
      });
    }
  }, [page]);

  return {
    allEmailDomains: query.data,
    isEmailDomainsLoading: query.isPending,
    isEmailDomainsSuccess: query.isSuccess,
    isEmailDomainsError: query.isError,
    emailDomainsError: query.error,
  };
}

//ADMIN CURRICULAR AREA CREATE DATA
export const useAdminEmailDomainCreateData = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: AllowedEmailDomainAttributes) =>
        createNewEmailDomain(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allEmailDomains"],
          exact: false,
        });
      },
    });

  return {
    createEmailDomain: mutate,
    createEmailDomainAsync: mutateAsync,
    data,
    isCreatingEmailDomainLoading: isPending,
    isCreatingEmailDomainSuccess: isSuccess,
    isCreatingEmailDomainError: isError,
    creatingCurricularAreaError: error,
  };
};

//ADMIN CURRICULAR AREA EDIT DATA
export const useAdminEmailDomainEditData = (id: string) => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: AllowedEmailDomainAttributes) =>
        updateEmailDomain(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allEmailDomains"],
          exact: false,
        });
      },
    });

  return {
    editEmailDomain: mutate,
    editEmailDomainAsync: mutateAsync,
    data,
    isEditingEmailDomainLoading: isPending,
    isEditingEmailDomainSuccess: isSuccess,
    isEditingEmailDomainError: isError,
    editingEmailDomainError: error,
  };
};

//ADMIN USER DELETE DATA
export function useAdminEmailDomainDeleteData(id: string) {
  const {
    mutate,
    mutateAsync,
    data: deletedData,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: () => deleteEmailDomain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allEmailDomains"],
        exact: false,
      });
    },
  });

  return {
    deleteEmailDomain: mutate,
    deleteEmailDomainAsync: mutateAsync,
    data: deletedData,
    isDeletingEmailDomainLoading: isPending,
    isDeletingEmailDomainSuccess: isSuccess,
    isDeletingEmailDomainError: isError,
    deletingCurricularDataError: error,
  };
}

// ADMIN ANNOUNCMENTS
export function useAdminAllAnnouncementsData(page: number) {
  const query = useQuery({
    queryKey: ["allAnnouncements", page],
    queryFn: () => getAllAnnouncements(page),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  // Prefetch next and previous pages
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["allAnnouncements", page + 1],
      queryFn: () => getAllAnnouncements(page + 1),
    });

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["allAnnouncements", page - 1],
        queryFn: () => getAllAnnouncements(page - 1),
      });
    }
  }, [page]);

  return {
    allAnnouncements: query.data,
    isAnnouncementsLoading: query.isPending,
    isAnnouncementsSuccess: query.isSuccess,
    isAnnouncementsError: query.isError,
    allAnnouncementsError: query.error,
  };
}

//ADMIN ANNOUNCMENTS CREATE DATA
export const useAdminAnnouncementCreateData = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: Announcement) => createNewAnnouncement(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allAnnouncements"],
          exact: false,
        });
      },
    });

  return {
    createAnnouncement: mutate,
    createAnnouncementAsync: mutateAsync,
    data,
    isCreatingAnnouncementLoading: isPending,
    isCreatingAnnouncementSuccess: isSuccess,
    isCreatingAnnouncementError: isError,
    creatingAnnouncementError: error,
  };
};

//ADMIN ANNOUNCMENT EDIT DATA
export const useAdminAnnouncementEditData = (id: string) => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: Announcement) => updateAnnouncment(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allAnnouncements"],
          exact: false,
        });
      },
    });

  return {
    editAnnouncement: mutate,
    editAnnouncementAsync: mutateAsync,
    data,
    isEditingAnnouncementLoading: isPending,
    isEditingAnnouncementSuccess: isSuccess,
    isEditingAnnouncementError: isError,
    editingAnnouncementError: error,
  };
};

//ADMIN USER DELETE DATA
export function useAdminAnnouncementDeleteData(id: string) {
  const {
    mutate,
    mutateAsync,
    data: deletedData,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: () => deleteAnnouncment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allAnnouncements"],

        exact: false,
      });
    },
  });

  return {
    deleteAnnouncement: mutate,
    deleteAnnouncementAsync: mutateAsync,
    data: deletedData,
    isDeletingAnnouncementLoading: isPending,
    isDeletingAnnouncementSuccess: isSuccess,
    isDeletingAnnouncementError: isError,
    deletingAnnouncementError: error,
  };
}

// GET ALL SITE SETTINGS
export function useAdminAllSiteSettings(page: number) {
  const query = useQuery({
    queryKey: ["allSiteSettings", page],
    queryFn: () => getAllSiteSettings(page),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  return {
    allSiteSettings: query.data,
    isSiteSettingsLoading: query.isPending,
    isSiteSettingsSuccess: query.isSuccess,
    isSiteSettingsError: query.isError,
    allSiteSettingsError: query.error,
  };
}
