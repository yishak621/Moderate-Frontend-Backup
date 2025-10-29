import { axiosInstance } from "@/lib/axiosInstance";
import { setToken } from "./tokenService";

//-------------------SUBJECT DOMAINS PUBLIC

export const subjectDomains = async () => {
  try {
    const res = await axiosInstance.get("/api/system/subject-domains");

    if (!res) {
      console.log("error");
    }

    return res.data.data;
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

//-------------------PLANS PUBLIC

export const plansPublic = async () => {
  try {
    const res = await axiosInstance.get("/api/plans");

    if (!res) {
      console.log("error");
    }

    return res.data.plans;
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

//-------------------CREATE CHECKOUT SESSION

export const createCheckoutSession = async (
  planName: string,
  stripePriceId: string
) => {
  try {
    const res = await axiosInstance.post("/api/subscription/checkout", {
      plan: planName,
      stripePriceId,
    });

    if (!res) {
      console.log("error");
    }

    return res.data.url; // Stripe checkout URL
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
