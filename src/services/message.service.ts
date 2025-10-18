import { axiosInstance } from "@/lib/axiosInstance";

//-------------------GET THREADS DATA

export const getThreads = async (userId: string) => {
  try {
    const { data } = await axiosInstance.get(
      `/api/messages/user/threads/${userId}`
    );

    return data;
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

//-------------------GET THREADS DATA

export const getMessages = async (receiverUserId: string) => {
  try {
    const { data } = await axiosInstance.get(
      `/api/messages/user/${receiverUserId}`
    );

    return data;
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
