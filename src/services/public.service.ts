import { axiosInstance } from "@/lib/axiosInstance";
import { setToken } from "./tokenService";

//-------------------LOGIN

export const subjectDomains = async () => {
  try {
    const res = await axiosInstance.get("/api/system/subject-domains");

    if (!res) {
      console.log("error");
    }

    if (res.data?.token) {
      setToken(res.data.token);
    }

    return res.data.data; // 👈 if this doesn't exist, you return undefined
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
