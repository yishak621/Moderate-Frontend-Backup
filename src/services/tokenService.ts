// services/tokenService.ts
import Cookies from "js-cookie";

export type ModerationStatus = "active" | "suspended" | "banned" | "pending_review";

export const setToken = (token: string) => {
  Cookies.set("jwt", token, {
    expires: 7, // days
    secure: true,
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

export const getToken = () => {
  return Cookies.get("jwt");
};
export const getRole = () => {
  return Cookies.get("role");
};
export const getModerationStatus = (): ModerationStatus | null => {
  const status = Cookies.get("moderationStatus");
  if (status && ["active", "suspended", "banned", "pending_review"].includes(status)) {
    return status as ModerationStatus;
  }
  return null;
};

export const removeToken = () => {
  Cookies.remove("jwt");
  Cookies.remove("role");
  Cookies.remove("moderationStatus");
};
