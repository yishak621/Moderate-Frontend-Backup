import { axiosInstance } from "@/lib/axiosInstance";
import { setToken } from "./tokenService";
import { Plan } from "@/types/admin.type";

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

//-------------------UPDATE PLANS API DATA

type AllowedPlanUpdate = Partial<
  Pick<
    Plan,
    | "name"
    | "description"
    | "price"
    | "currency"
    | "interval"
    | "features"
    | "savings"
    | "sortOrder"
    | "isPopular"
    | "isActive"
  >
> & {
  // allow features as comma-separated string too (server supports both)
  features?: string | string[];
};

export const updatePlansApiData = async (
  id: string,
  data: AllowedPlanUpdate
) => {
  try {
    // Only send allowed fields (server ignores others, but we keep client strict)
    const payload: AllowedPlanUpdate = {
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency,
      interval: data.interval,
      features: data.features,
      savings: data.savings,
      sortOrder: data.sortOrder,
      isPopular: data.isPopular,
      isActive: data.isActive,
    };

    const res = await axiosInstance.patch(`/api/plans/${id}/local`, payload);

    if (!res) {
      console.log("error");
    }

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
