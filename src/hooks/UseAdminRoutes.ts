//AdminOverview
import { User } from "@/app/types/user";
import {
  AdminOverview,
  createNewAnnouncement,
  createNewCurricularArea,
  createNewEmailDomain,
  createNewPlan,
  createNewSetting,
  createNewUser,
  deleteAnnouncment,
  deleteCurricularArea,
  deleteEmailDomain,
  deletePlan,
  deleteSiteSetting,
  deleteUserData,
  editUserData,
  getAllAnnouncements,
  getAllCurricularAreas,
  getAllEmailDomains,
  getAllPlans,
  getAllSiteSettings,
  getAllUsers,
  getSystemAdmins,
  updateAnnouncment,
  updateCurricularArea,
  updateEmailDomain,
  updatePlan,
  updateSiteSetting,
  viewUserData,
  impersonateUser,
  endImpersonation,
} from "@/services/admin.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { SignupFormDataTypes } from "@/types/authData.type";
import { Curricular } from "@/app/types/curricular";
import { AllowedEmailDomainAttributes } from "@/types/typeLog";
import { Announcement } from "@/app/types/announcement";
import { Plan, Setting } from "@/types/admin.type";

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

// SYSTEM ADMINS LIST
export function useSystemAdmins(
  page: number,
  limit: number,
  search: string = ""
) {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const query = useQuery({
    queryKey: ["systemAdmins", page, limit, debouncedSearch],
    queryFn: () => getSystemAdmins(page, limit, debouncedSearch),
    placeholderData: (prev) => prev,
    staleTime: 2 * 60 * 1000,
  });

  return {
    admins: query.data?.admins ?? [],
    meta: query.data?.meta,
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error,
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
  }, [page, curricular, debouncedSearch]); 

  return {
    allUsers: query.data,
    isUsersLoading: query.isPending,
    isUsersFetching: query.isFetching,
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
export function useAdminCurricularAreasData(page: number, search?: string) {
  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search || "");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search || ""), 1000);
    return () => clearTimeout(handler);
  }, [search]);

  const query = useQuery({
    queryKey: ["allCurricularAreas", page, debouncedSearch],
    queryFn: () => getAllCurricularAreas(page, debouncedSearch),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  // Prefetch next and previous pages
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["allCurricularAreas", page + 1, debouncedSearch],
      queryFn: () => getAllCurricularAreas(page + 1, debouncedSearch),
    });

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["allCurricularAreas", page - 1, debouncedSearch],
        queryFn: () => getAllCurricularAreas(page - 1, debouncedSearch),
      });
    }
  }, [page, debouncedSearch]);

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

// ADMIN EMAIL DOMAINS DATA
export function useAdminEmailDomainData(page: number, search?: string) {
  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search || "");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search || ""), 1000);
    return () => clearTimeout(handler);
  }, [search]);

  const query = useQuery({
    queryKey: ["allEmailDomains", page, debouncedSearch],
    queryFn: () => getAllEmailDomains(page, debouncedSearch),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  // Prefetch next and previous pages
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["allEmailDomains", page + 1, debouncedSearch],
      queryFn: () => getAllEmailDomains(page + 1, debouncedSearch),
    });

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["allEmailDomains", page - 1, debouncedSearch],
        queryFn: () => getAllEmailDomains(page - 1, debouncedSearch),
      });
    }
  }, [page, debouncedSearch]);

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

//ADMIN SETTING CREATE DATA
export const useAdminSettingCreateData = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: Setting) => createNewSetting(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allSiteSettings"],
          exact: false,
        });
      },
    });

  return {
    createSetting: mutate,
    createSettingAsync: mutateAsync,
    data,
    isCreatingSettingLoading: isPending,
    isCreatingSettingSuccess: isSuccess,
    isCreatingSettingError: isError,
    creatingSettingError: error,
  };
};

//ADMIN SITE SETTINGS EDIT DATA
export const useAdminUpdateSiteSetting = (key: string) => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: Setting) => updateSiteSetting(key, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allSiteSettings"],
          exact: false,
        });
      },
    });

  return {
    editSiteSetting: mutate,
    editSiteSettingAsync: mutateAsync,
    data,
    isEditingSiteSettingLoading: isPending,
    isEditingSiteSettingSuccess: isSuccess,
    isEditingSiteSettingError: isError,
    editingSiteSettingError: error,
  };
};

//ADMIN SITE SETTINGS EDIT DATA
export const useAdminDeleteSiteSetting = (key: string) => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: () => deleteSiteSetting(key),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allSiteSettings"],
          exact: false,
        });
      },
    });

  return {
    deleteSiteSetting: mutate,
    deleteSiteSettingAsync: mutateAsync,
    data,
    isDeleteSiteSettingLoading: isPending,
    isDeleteSiteSettingSuccess: isSuccess,
    isDeleteSiteSettingError: isError,
    deletingSiteSettingError: error,
  };
};

// GET ALL Plans
export function useAdminAllPlans() {
  const query = useQuery({
    queryKey: ["allPlans"],
    queryFn: () => getAllPlans(),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  return {
    allPlans: query.data,
    isPlansLoading: query.isPending,
    isPlansSuccess: query.isSuccess,
    isPlansError: query.isError,
    allPlansError: query.error,
  };
}
//ADMIN SETTING CREATE PLAN
export const useAdminCreatePlan = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: Plan) => createNewPlan(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allPlans"],
          exact: false,
        });
      },
    });

  return {
    createPlan: mutate,
    createPlanAsync: mutateAsync,
    data,
    isCreatingPlanLoading: isPending,
    isCreatingPlanSuccess: isSuccess,
    isCreatingPlanError: isError,
    creatingPlanError: error,
  };
};
//ADMIN SITE SETTINGS EDIT DATA
export const useAdminUpdatePlan = (key: string) => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: Plan) => updatePlan(key, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allPlans"],
          exact: false,
        });
      },
    });

  return {
    editPlan: mutate,
    editPlanAsync: mutateAsync,
    data,
    isEditingPlanLoading: isPending,
    isEditingPlanSuccess: isSuccess,
    isEditingPlanError: isError,
    editingPlanError: error,
  };
};

//ADMIN SITE SETTINGS EDIT DATA
export const useAdminDeletePlan = (id: string) => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: () => deletePlan(id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["allPlans"],
          exact: false,
        });
      },
    });

  return {
    deletePlan: mutate,
    deletePlanAsync: mutateAsync,
    data,
    isDeletePlanLoading: isPending,
    isDeletePlanSuccess: isSuccess,
    isDeletePlanError: isError,
    deletingPlanError: error,
  };
};

//-------------------IMPERSONATE USER
export const useImpersonateUser = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (userId: string) => impersonateUser(userId),
    });

  return {
    impersonateUser: mutate,
    impersonateUserAsync: mutateAsync,
    data,
    isImpersonating: isPending,
    isImpersonateSuccess: isSuccess,
    isImpersonateError: isError,
    impersonateError: error,
  };
};

//-------------------END IMPERSONATION
export const useEndImpersonation = () => {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: () => endImpersonation(),
    });

  return {
    endImpersonation: mutate,
    endImpersonationAsync: mutateAsync,
    data,
    isEndingImpersonation: isPending,
    isEndImpersonationSuccess: isSuccess,
    isEndImpersonationError: isError,
    endImpersonationError: error,
  };
};
