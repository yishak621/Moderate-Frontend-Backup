import { axiosInstance } from "@/lib/axiosInstance";
import {
  forgotPasswordFormDataTypes,
  loginFormDataTypes,
  ResetPasswordFormDataTypes,
  ResetPasswordPropsTypes,
  SignupFormDataTypes,
} from "@/types/authData.type";
import { setToken } from "./tokenService";

//-------------------LOGIN

export const login = async (data: loginFormDataTypes) => {
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

//-------------------SIGNUP

export const signup = async (data: SignupFormDataTypes) => {
  try {
    const res = await axiosInstance.post("/api/auth/register", data);

    if (!res) {
      console.log("error");
    }
    console.log(res.data);
    return res.data;
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

//-------------------FORGOT PASSWORD

export const forgotPassword = async (data: forgotPasswordFormDataTypes) => {
  try {
    const res = await axiosInstance.post("/api/auth/forgotPassword", data);

    if (!res) {
      console.log("error");
    }
    console.log(res.data);
    return res.data;
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

//-------------------RESET PASSWORD

export const resetPassword = async ({
  data,
  resetToken,
}: ResetPasswordPropsTypes) => {
  try {
    console.log(resetToken, "reset token");
    const res = await axiosInstance.post(
      `/api/auth/resetPassword/${resetToken}`,
      data
    );

    if (!res) {
      console.log("error");
    }
    console.log(res.data);
    return res.data;
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
