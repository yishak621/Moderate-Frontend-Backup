import { axiosInstance } from "@/lib/axiosInstance";

//-------------------CREATE BILLING PORTAL SESSION

export const createBillingPortalSession = async () => {
  try {
    const res = await axiosInstance.post("/api/subscription/billing-portal");

    if (!res) {
      console.log("error");
    }

    return res.data.url; // Stripe billing portal URL
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

