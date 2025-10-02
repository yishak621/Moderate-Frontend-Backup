import { axiosInstance } from "@/lib/axiosInstance";
import { setToken } from "./tokenService";

//-------------------GET ALL USERS

export const getAllUsers = async (page: number) => {
  try {
    const res = await axiosInstance.get(`/api/system/users?page=${page}`);

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
