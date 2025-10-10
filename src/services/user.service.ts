import { User } from "@/app/types/user";
import { axiosInstance } from "@/lib/axiosInstance";
import {
  forgotPasswordFormDataTypes,
  loginFormDataTypes,
  ResetPasswordFormDataTypes,
  ResetPasswordPropsTypes,
  SignupFormDataTypes,
} from "@/types/authData.type";

//-------------------GET USER DATA

export const userData = async () => {
  try {
    const res = await axiosInstance.get("/api/user/profile/data");

    if (!res) {
      console.log("error");
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

//-------------------UPDATE USER DATA

export const updateUserData = async (data:User) => {
  try {
    const res = await axiosInstance.patch("/api/user/profile/data",data);

    if (!res) {
      console.log("error");
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
