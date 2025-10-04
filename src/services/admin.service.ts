import { axiosInstance } from "@/lib/axiosInstance";
import { setToken } from "./tokenService";
import { User } from "@/app/types/user";
import { SignupFormDataTypes } from "@/types/authData.type";
import { Curricular } from "@/app/types/curricular";
import { AllowedEmailDomainAttributes } from "@/types/typeLog";

//-------------------ADMIN ONLY ROUTES
export const AdminOverview = async () => {
  try {
    const res = await axiosInstance.get("/api/system/overview");

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};

//-------------------GET ALL USERS

export const getAllUsers = async (
  page: number,
  curricular: string,
  search: string
) => {
  try {
    const params = new URLSearchParams({ page: page.toString() });
    if (curricular) params.append("curricular", curricular);
    if (search) params.append("search", search);

    const res = await axiosInstance.get(
      `/api/system/users?${params.toString()}`
    );

    if (!res) {
      throw new Error("No response from server");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};

//-------------------CREATE NEW USER
export const createNewUser = async (data: SignupFormDataTypes) => {
  try {
    const res = await axiosInstance.post(`/api/system/users`, data);

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};
//-------------------ADMIN ONLY ROUTES
export const viewUserData = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/api/system/users/${id}`);

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};
//-------------------ADMIN ONLY ROUTES
export const editUserData = async (id: string, data: User) => {
  try {
    const res = await axiosInstance.patch(`/api/system/users/${id}`, data);

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};
//-------------------ADMIN ONLY ROUTES
export const deleteUserData = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/api/system/users/${id}`);

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};

//-------------------GET ALL CURRICULAR AREAS
export const getAllCurricularAreas = async (page: number) => {
  try {
    const res = await axiosInstance.get(
      `/api/system/subject-domains/admin?page=${page}`
    );

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};

//-------------------CREATE NEW CURRICULAR AREA
export const createNewCurricularArea = async (data: Curricular) => {
  try {
    const res = await axiosInstance.post(`/api/system/subject-domains`, data);

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};

//-------------------UPDATE CURRICULAR AREA
export const updateCurricularArea = async (id: string, data: Curricular) => {
  try {
    const res = await axiosInstance.patch(
      `/api/system/subject-domains/${id}`,
      data
    );

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};

//-------------------DELETE CURRICULAR AREA
export const deleteCurricularArea = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/api/system/subject-domains/${id}`);

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};

//-------------------GET ALL EMAIL DOMAINS
export const getAllEmailDomains = async (page: number) => {
  try {
    const res = await axiosInstance.get(
      `/api/system/allowed-domains?page=${page}`
    );

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};

//-------------------CREATE NEW EMAIL DOMAINS
export const createNewEmailDomain = async (
  data: AllowedEmailDomainAttributes
) => {
  try {
    const res = await axiosInstance.post(`/api/system/allowed-domains`, data);

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};

//-------------------UPDATE EMAIL DOMAINS
export const updateEmailDomain = async (
  id: string,
  data: AllowedEmailDomainAttributes
) => {
  try {
    const res = await axiosInstance.patch(
      `/api/system/allowed-domains/${id}`,
      data
    );

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};

//-------------------DELETE EMAIL DOMAINS
export const deleteEmailDomain = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/api/system/allowed-domains/${id}`);

    if (!res) {
      console.log("error");
    }

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Something went wrong");
    }
  }
};
