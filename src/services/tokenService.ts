// services/tokenService.ts
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { customJwtPayload } from "@/types/postAttributes";

export type ModerationStatus =
  | "active"
  | "suspended"
  | "banned"
  | "pending_review";

export const setToken = (token: string) => {
  Cookies.set("jwt", token, {
    expires: 7, // days
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "strict",
  });
};
export const setRole = (role: string) => {
  Cookies.set("role", role);
};

export const setModerationStatus = (status: ModerationStatus) => {
  Cookies.set("moderationStatus", status, {
    expires: 7, // days
    secure: true,
    sameSite: "strict",
  });
};

export const setSubscriptionStatus = (status: string | null) => {
  if (status) {
    Cookies.set("subscriptionStatus", status, {
      expires: 7, // days
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "strict",
    });
  } else {
    Cookies.remove("subscriptionStatus");
  }
};

export const getSubscriptionStatus = (): string | null => {
  return Cookies.get("subscriptionStatus") || null;
};

export const setSubscriptionPlan = (plan: string | null) => {
  if (plan) {
    Cookies.set("subscriptionPlan", plan, {
      expires: 7, // days
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "strict",
    });
  } else {
    Cookies.remove("subscriptionPlan");
  }
};

export const getSubscriptionPlan = (): string | null => {
  return Cookies.get("subscriptionPlan") || null;
};

export const getToken = () => {
  // Check for impersonation token first, then regular token
  return Cookies.get("jwtImpersonation") || Cookies.get("jwt");
};

export const getRegularToken = () => {
  return Cookies.get("jwt");
};

export const getImpersonationToken = () => {
  return Cookies.get("jwtImpersonation");
};

export const setImpersonationToken = (token: string) => {
  Cookies.set("jwtImpersonation", token, {
    expires: 1, // 1 day
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "strict",
  });
};

export const removeImpersonationToken = () => {
  Cookies.remove("jwtImpersonation");
};

export const getRole = () => {
  const impersonationToken = Cookies.get("jwtImpersonation");
  if (impersonationToken) {
    try {
      const decoded = jwtDecode(impersonationToken) as customJwtPayload;
      return decoded?.role || Cookies.get("role");
    } catch {
      return Cookies.get("role");
    }
  }
  return Cookies.get("role");
};
export const getModerationStatus = (): ModerationStatus | null => {
  const status = Cookies.get("moderationStatus");
  if (
    status &&
    ["active", "suspended", "banned", "pending_review"].includes(status)
  ) {
    return status as ModerationStatus;
  }
  return null;
};

export const removeToken = () => {
  Cookies.remove("jwt");
  Cookies.remove("jwtImpersonation");
  Cookies.remove("role");
  Cookies.remove("moderationStatus");
  Cookies.remove("subscriptionStatus");
  Cookies.remove("subscriptionPlan");
};
