import {
  getToken,
  getImpersonationToken,
  getRole,
  setToken,
  setRole,
  setModerationStatus,
} from "@/services/tokenService";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  let impersonationToken: string | null = null;
  try {
    impersonationToken = getImpersonationToken() ?? null;
  } catch {
    impersonationToken = null;
  }

  const regularToken = getToken();
  const token = impersonationToken || regularToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error.response?.data;
    const statusCode =
      error.response?.status ||
      responseData?.error?.statusCode ||
      responseData?.statusCode;

    // Handle suspended/banned users with requiresAppeal flag
    if (
      statusCode === 403 &&
      responseData?.requiresAppeal &&
      (responseData?.code === "ACCOUNT_BANNED" ||
        responseData?.code === "ACCOUNT_SUSPENDED")
    ) {
      if (typeof window !== "undefined") {
        const role = getRole();
        if (role === "TEACHER") {
          if (responseData?.token) {
            setToken(responseData.token);
            if (responseData?.user?.role) {
              setRole(responseData.user.role);
            }
            // Store moderation status
            if (responseData?.user?.moderationStatus?.status) {
              setModerationStatus(responseData.user.moderationStatus.status);
            } else if (responseData?.code === "ACCOUNT_BANNED") {
              setModerationStatus("banned");
            } else if (responseData?.code === "ACCOUNT_SUSPENDED") {
              setModerationStatus("suspended");
            }
          }
          // Redirect to appeals page
          window.location.href = "/dashboard/teacher/appeals";
          return Promise.reject(error);
        }
      }
    }

    const errorMessage =
      responseData?.message || responseData?.error?.Errormessage || "";
    if (
      statusCode === 403 &&
      errorMessage.toLowerCase().includes("account has been disabled")
    ) {
      if (typeof window !== "undefined") {
        const role = getRole();
        if (role === "TEACHER") {
          window.location.href = "/dashboard/teacher/appeals";
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  }
);
