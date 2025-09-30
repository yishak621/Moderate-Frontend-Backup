import { axiosInstance } from "@/lib/axiosInstance";
import { loginData } from "@/types/authData";
import { setToken } from "./tokenService";

//-------------------LOGIN

export const login = async (data: loginData) => {
  try {
    const res = await axiosInstance.post("/api/auth/login", data);

    if (!res) {
      console.log("error");
    }
    //set token
    if (res.data?.token) {
      setToken(res.data.token);
    }
    return res.data.user;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

//-------------------SIGNUP

export const signup = async (data: loginData) => {
  try {
    const res = await axiosInstance.post("/api/auth/login", data);

    if (!res) {
      console.log("error");
    }
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};
