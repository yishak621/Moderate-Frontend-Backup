import { axiosInstance } from "@/lib/axiosInstance";
import Cookies from "js-cookie";

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });

  const token = response.data.token;

  Cookies.set("token", token, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  });
  return response.data;
};

export const logout = async () => {
  Cookies.remove("token");
};
