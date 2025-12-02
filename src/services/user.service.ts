import { SettingItem, User } from "@/app/types/user";
import { axiosInstance } from "@/lib/axiosInstance";
import { Grade, GradeData } from "@/types/Post";
import { PostCreateInput } from "@/types/postAttributes";
import {
  GradingTemplate,
  CreateGradingTemplateInput,
  UpdateGradingTemplateInput,
} from "@/types/gradingTemplate";

//-------------------TYPES

type UserPostsFilter =
  | "all"
  | "moderated"
  | "pending"
  | "following"
  | "favorites";

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

export const updateUserData = async (data: User) => {
  try {
    const res = await axiosInstance.patch("/api/user/profile/data", data);

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

//------------------- USER OVERVIEW STATS

export const userOverviewStats = async () => {
  try {
    const res = await axiosInstance.get("/api/user/stats");

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

//------------------- USER POST FEEDS

export const userPostFeeds = async (page = 1, filter: UserPostsFilter = "all") => {
  try {
    const res = await axiosInstance.get("/api/user/post/feeds", {
      params: { page, filter },
    });

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

//------------------- USER SINGLE POST

export const userSinglePostData = async (postId: string) => {
  try {
    const res = await axiosInstance.get(`/api/user/post/${postId}`);

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

//------------------- USER MY POSTS (filters + pagination)

export const userMyPostsFeeds = async ({
  filter = "pending",
  page = 1,
  limit = 10,
}: {
  filter?: UserPostsFilter;
  page?: number;
  limit?: number;
}) => {
  try {
    const params = {
      filter: String(filter || "pending"),
      page: Number(page),
      limit: Number(limit),
    };
    const res = await axiosInstance.get("/api/user/post/feeds", {
      params,
    });

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

export const userCreatePost = async (
  data: PostCreateInput,
  domainId: string | boolean
) => {
  console.log(data, "data");
  try {
    const res = await axiosInstance.post(`/api/user/post/${domainId}`, data);

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

//-------------------UPDATE USER POST
export const updateUserPost = async (postId: string, data: PostCreateInput) => {
  try {
    const res = await axiosInstance.patch(`/api/user/post/${postId}`, data);
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

//--------------------DELETE USER POST
export const deleteUserPost = async (postId: string) => {
  try {
    const res = await axiosInstance.delete(`/api/user/post/${postId}`);
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

//--------------------ADD TO FAVORITES
export const addToFavorites = async (postId: string) => {
  try {
    const res = await axiosInstance.post(`/api/user/post/${postId}/favorite`);
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

//--------------------REMOVE FROM FAVORITES
export const removeFromFavorites = async (postId: string) => {
  try {
    const res = await axiosInstance.delete(`/api/user/post/${postId}/favorite`);
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

//--------------------GET FAVORITE POSTS
export const getFavoritePosts = async () => {
  try {
    const res = await axiosInstance.get("/api/user/favorites");
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

//-------------------UPLOAD FILE TO THE API
export const uploadFileApi = async (
  file: File,
  textContent?: string
) => {
  try {
    const formData = new FormData();
    formData.append("files", file);
    
    // Send textContent if provided (required for embedding generation)
    if (textContent) {
      formData.append("textContent", textContent);
    }

    const res = await axiosInstance.post("/api/user/uploads", formData);

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
//-------------------DELETE FILE TO THE API

export const deleteFileApi = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/api/user/uploads/${id}`);

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
//-------------------SAVE /UPDATE USER GRADE AND COMMENT

export const saveUserGrade = async (postId: string, data: GradeData) => {
  console.log(data,'coomentdata')
  try {
    // If gradeId exists, use PUT to update, otherwise POST to create
    const method = data.gradeId ? "patch" : "post";
    const url = data.gradeId
      ? `/api/user/post/${postId}/grade/${data.gradeId}/comment/${data.commentId}`
      : `/api/user/post/${postId}/grade`;

    const res = await axiosInstance[method](url, data);

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

//-------------------DELETE USER GRADE

export const deleteUserGrade = async (
  postId: string,
  gradeId: string,
  commentId: string
) => {
  try {
    const res = await axiosInstance.delete(
      `/api/user/post/${postId}/grade/${gradeId}/comment/${commentId}`
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

//-------------------GET USER DATA

export const getAllAnnouncements = async () => {
  try {
    const res = await axiosInstance.get("/api/announcments/users");

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

//-------------------SAVE USER SETTINGS

export const saveUserSettings = async (data: { settings: SettingItem }) => {
  try {
    const res = await axiosInstance.post(`/api/user/settings`, data);

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

//-------------------UPLOAD PROFILE PICTURE

export const uploadProfilePicture = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("picture", file);

    const res = await axiosInstance.post("/api/user/profile/picture", formData);

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

//-------------------DELETE PROFILE PICTURE

export const deleteProfilePicture = async () => {
  try {
    const res = await axiosInstance.delete("/api/user/profile/picture");

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

//-------------------DELETE ACCOUNT

export const deleteAccount = async (password?: string) => {
  try {
    const res = await axiosInstance.delete("/api/user/account", {
      data: password ? { password } : undefined,
    });

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

//-------------------GRADING TEMPLATE OPERATIONS

// Save a new grading template
export const saveGradingTemplate = async (data: CreateGradingTemplateInput) => {
  try {
    const res = await axiosInstance.post("/api/user/grading-templates", data);
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

// Get all user's grading templates
export const getGradingTemplates = async () => {
  try {
    const res = await axiosInstance.get("/api/user/grading-templates");
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

// Get a single grading template by ID
export const getGradingTemplateById = async (templateId: string) => {
  try {
    const res = await axiosInstance.get(
      `/api/user/grading-template/${templateId}`
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

// Update a grading template
export const updateGradingTemplate = async (
  templateId: string,
  data: UpdateGradingTemplateInput
) => {
  try {
    const res = await axiosInstance.patch(
      `/api/user/grading-template/${templateId}`,
      data
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

// Delete a grading template
export const deleteGradingTemplate = async (templateId: string) => {
  try {
    const res = await axiosInstance.delete(
      `/api/user/grading-template/${templateId}`
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

//------------------------------------------FOLLOW USER OPERATIONS

//---------FOLLOW USER
export const followUser = async (userId: string) => {
  try {
    const res = await axiosInstance.post(`/api/user/follow/${userId}`);
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

//---------UNFOLLOW USER
export const unfollowUser = async (userId: string) => {
  try {
    const res = await axiosInstance.delete(`/api/user/follow/${userId}`);
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

//---------GET FOLLOWING USERS
export const getFollowingUsers = async () => {
  try {
    const res = await axiosInstance.get("/api/user/following");
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

//---------GET FOLLOWERS
export const getFollowers = async () => {
  try {
    const res = await axiosInstance.get("/api/user/followers");
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
