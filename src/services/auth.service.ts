import { axiosInstance } from "@/lib/axiosInstance";
import {
  domainVerifyFormDataTypes,
  forgotPasswordFormDataTypes,
  loginFormDataTypes,
  ResetPasswordFormDataTypes,
  ResetPasswordPropsTypes,
  SignupFormDataTypes,
} from "@/types/authData.type";
import { setRole, setToken } from "./tokenService";

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
      setRole(res.data.user.role);
    }
    return res.data.user;
  } catch (error) {
    // Preserve error structure for special error codes
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as any;
      const responseData = axiosError.response?.data;

      // If there's a specific error code, preserve the structure
      if (responseData?.code) {
        const customError = new Error(
          responseData.message || axiosError.message || "Something went wrong"
        ) as Error & { code?: string; response?: any };
        customError.code = responseData.code;
        customError.response = axiosError.response;
        throw customError;
      }

      throw new Error(
        responseData?.message || axiosError.message || "Something went wrong"
      );
    }

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
      throw error;
      // throw new Error(
      //   // // @ts-expect-error: might be Axios error with response
      //   // error?.response?.data?.message ||
      //   //   error.message ||
      //   //   "Something went wrong"
      // );
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

//-------------------VERIFY DOMAIN

export const verifyDomainAdmin = async (data: domainVerifyFormDataTypes) => {
  try {
    const res = await axiosInstance.post(
      "/api/auth/request-domain-verification",
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
