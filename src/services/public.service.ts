import { axiosInstance } from "@/lib/axiosInstance";
import { loginData } from "@/types/authData";
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
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};
