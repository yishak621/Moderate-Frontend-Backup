import { Message } from "@/app/types/threads";
import { axiosInstance } from "@/lib/axiosInstance";
import {
  GroupConversation,
  CreateGroupInput,
  AddMembersInput,
  GroupMessage,
} from "@/app/types/groupChat";

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
    const res = await axiosInstance.post("/api/messages", message);

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

//-------------------GROUP CHAT FUNCTIONS

// Create a new group chat
export const createGroupChat = async (data: CreateGroupInput) => {
  try {
    const res = await axiosInstance.post("/api/messages/group", data);
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

// Get all conversations (direct + group)
export const getAllConversations = async () => {
  try {
    const res = await axiosInstance.get("/api/messages/conversations");
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

// Get group messages
export const getGroupMessages = async (conversationId: string) => {
  try {
    const res = await axiosInstance.get(
      `/api/messages/group/${conversationId}/messages`
    );
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

// Add members to group
export const addGroupMembers = async (
  conversationId: string,
  data: AddMembersInput
) => {
  try {
    const res = await axiosInstance.post(
      `/api/messages/group/${conversationId}/members`,
      data
    );
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

// Remove member from group
export const removeGroupMember = async (
  conversationId: string,
  userId: string
) => {
  try {
    const res = await axiosInstance.delete(
      `/api/messages/group/${conversationId}/members/${userId}`
    );
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

// Leave group (self-removal)
export const leaveGroup = async (conversationId: string) => {
  try {
    const res = await axiosInstance.delete(
      `/api/messages/group/${conversationId}/leave`
    );
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

// Delete direct chat with a user
export const deleteDirectChat = async (otherUserId: string) => {
  try {
    const res = await axiosInstance.delete(
      `/api/messages/direct/${otherUserId}`
    );
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

// Get group members (owner only for full details, but we'll handle UI accordingly)
export const getGroupMembers = async (conversationId: string) => {
  try {
    const res = await axiosInstance.get(
      `/api/messages/group/${conversationId}/members`
    );
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

