// services/tokenService.ts
import Cookies from "js-cookie";

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

export const getToken = () => {
  return Cookies.get("jwt");
};
export const getRole = () => {
  return Cookies.get("role");
};
export const removeToken = () => {
  Cookies.remove("jwt");
};
