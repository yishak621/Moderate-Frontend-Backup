import { axiosInstance } from "@/lib/axiosInstance";
import { setToken } from "./tokenService";
import { User } from "@/app/types/user";

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
