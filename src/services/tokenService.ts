// services/tokenService.ts
import Cookies from "js-cookie";

export const setToken = (token: string) => {
  Cookies.set("jwt", token, {
    expires: 7, // days
    secure: true,
    sameSite: "strict",
  });
};

export const getToken = () => {
  return Cookies.get("jwt");
};

export const removeToken = () => {
  Cookies.remove("jwt");
};
