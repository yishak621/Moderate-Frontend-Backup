import { axiosInstance } from "@/lib/axiosInstance";
import {
  domainVerifyFormDataTypes,
  forgotPasswordFormDataTypes,
  loginFormDataTypes,
  ResetPasswordFormDataTypes,
  ResetPasswordPropsTypes,
  SignupFormDataTypes,
} from "@/types/authData.type";
import { setRole, setToken, setModerationStatus, setSubscriptionStatus, setSubscriptionPlan } from "./tokenService";

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
      // Store moderation status if available
      if (res.data.user?.moderationStatus?.status) {
        setModerationStatus(res.data.user.moderationStatus.status);
      } else {
        // Default to active if no moderation status
        setModerationStatus("active");
      }
      // Store subscription status
      if (res.data.user?.subscriptionStatus) {
        setSubscriptionStatus(res.data.user.subscriptionStatus);
      } else {
        setSubscriptionStatus(null);
      }
      // Store subscription plan
      if (res.data.user?.subscriptionPlan) {
        setSubscriptionPlan(res.data.user.subscriptionPlan);
      } else {
        setSubscriptionPlan(null);
      }
    }
    return res.data.user;
  } catch (error) {
    // Preserve error structure for special error codes
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as any;
      const responseData = axiosError.response?.data;
      const statusCode = axiosError.response?.status;

      // Handle payment required (402) - backend returns this when subscription is required
      // This covers: trial expired, checkout incomplete, or no active subscription
      if (statusCode === 402) {
        const customError = new Error(
          responseData?.message || "Active subscription required to access this platform."
        ) as Error & {
          code?: string;
          response?: any;
          requiresPayment?: boolean;
          subscriptionRequired?: boolean;
          checkoutIncomplete?: boolean;
          checkoutUrl?: string;
          trialEndsAt?: string;
        };
        // Preserve the actual error code from backend
        customError.code = responseData?.code || "PAYMENT_REQUIRED";
        customError.requiresPayment = responseData?.paymentRequired ?? true;
        customError.subscriptionRequired = responseData?.subscriptionRequired ?? true;
        customError.checkoutIncomplete = responseData?.checkoutIncomplete ?? false;
        customError.checkoutUrl = responseData?.checkoutUrl;
        customError.trialEndsAt = responseData?.trialEndsAt || responseData?.trialEndDate;
        customError.response = axiosError.response;
        throw customError;
      }

      // Handle suspended/banned users - they get 403 but with token
      if (
        responseData?.requiresAppeal &&
        (responseData?.code === "ACCOUNT_BANNED" ||
          responseData?.code === "ACCOUNT_SUSPENDED")
      ) {
        // Store token even though it's an error response
        if (responseData?.token) {
          setToken(responseData.token);
          if (responseData?.user?.role) {
            setRole(responseData.user.role);
          }
          // Store moderation status from response
          if (responseData?.user?.moderationStatus?.status) {
            setModerationStatus(responseData.user.moderationStatus.status);
          } else if (responseData?.code === "ACCOUNT_BANNED") {
            setModerationStatus("banned");
          } else if (responseData?.code === "ACCOUNT_SUSPENDED") {
            setModerationStatus("suspended");
          }
          // Store subscription status from response
          if (responseData?.user?.subscriptionStatus) {
            setSubscriptionStatus(responseData.user.subscriptionStatus);
          } else {
            setSubscriptionStatus(null);
          }
          // Store subscription plan from response
          if (responseData?.user?.subscriptionPlan) {
            setSubscriptionPlan(responseData.user.subscriptionPlan);
          } else {
            setSubscriptionPlan(null);
          }
        }

        // Create custom error with all the data
        const customError = new Error(
          responseData.message || "Your account has been suspended or banned"
        ) as Error & {
          code?: string;
          response?: any;
          requiresAppeal?: boolean;
          user?: any;
          suspendedUntil?: string;
        };
        customError.code = responseData.code;
        customError.requiresAppeal = responseData.requiresAppeal;
        customError.user = responseData.user;
        customError.suspendedUntil = responseData.suspendedUntil;
        customError.response = axiosError.response;
        throw customError;
      }

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
