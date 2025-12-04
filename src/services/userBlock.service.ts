import { axiosInstance } from "@/lib/axiosInstance";

export interface BlockedUser {
  id: string;
  blockedId: string;
  reason?: string;
  createdAt: string;
  blocked: {
    id: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
  };
}

export interface BlockStatus {
  success: boolean;
  blockedByMe: boolean;
  blockedByThem: boolean;
  canMessage: boolean;
}

// Get list of users you've blocked
export const getBlockedUsers = async (): Promise<{ blockedUsers: BlockedUser[] }> => {
  try {
    const res = await axiosInstance.get("/api/blocks");
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

// Check block status with a user
export const getBlockStatus = async (userId: string): Promise<BlockStatus> => {
  try {
    const res = await axiosInstance.get(`/api/blocks/status/${userId}`);
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

// Block a user
export const blockUser = async (userId: string, reason?: string) => {
  try {
    const res = await axiosInstance.post(`/api/blocks/${userId}`, { reason });
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

// Unblock a user
export const unblockUser = async (userId: string) => {
  try {
    const res = await axiosInstance.delete(`/api/blocks/${userId}`);
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

