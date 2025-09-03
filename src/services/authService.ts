import { axiosInstance } from "@/lib/axiosInstance";

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });

  const token = response.data.token;
};
