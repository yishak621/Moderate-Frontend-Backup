import { Message } from "@/app/types/threads";
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

//-------------------GET MESSAGES

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

//------------------------MARK US READ

export const markMessageAsRead = async (receiverUserId: string) => {
  try {
    const res = await axiosInstance.patch(
      `/api/messages/read/${receiverUserId}`
    );

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

//-------------------------SEND MESSAGE

export const sendMessageAPI = async (message: Message) => {
  try {
    const res = await axiosInstance.post("/api/user/uploads", message);

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
