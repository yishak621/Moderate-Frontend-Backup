import { SettingItem, User } from "@/app/types/user";
import { axiosInstance } from "@/lib/axiosInstance";
import { Grade, GradeData } from "@/types/Post";
import { PostCreateInput } from "@/types/postAttributes";

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

export const userPostFeeds = async () => {
  try {
    const res = await axiosInstance.get("/api/user/post/feeds");

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

//------------------- USER POST FEEDS

export const userMyPostsFeeds = async () => {
  try {
    const res = await axiosInstance.get("/api/user/post");

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
//-------------------UPLOAD FILE TO THE API
export const uploadFileApi = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("files", file);

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
//-------------------SAVE USER GRADE AND COMMENT

export const saveUserGrade = async (postId: string, data: GradeData) => {
  try {
    const res = await axiosInstance.post(
      `/api/user/post/${postId}/grade`,
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
// {
//   title: "Chemistry midterm exam",
//   description: "Post description",
//   domains: ["domainId1", "domainId2"],
//   grading: {
//     gradeType: "rubric",
//     criteria: [
//       { key: "clarity", label: "Clarity", maxPoints: 10 },
//       { key: "accuracy", label: "Accuracy", maxPoints: 15 },
//     ]
//   },
//   uploads: [
//     "https://api.moderatetech.co.uk/app/uploads/file1.png",
//     "https://api.moderatetech.co.uk/app/uploads/file2.pdf"
//   ]
// }
// Perfect! Here's a concise plan to adjust the frontend inputs to match the updated Post + Grade API:

// 1️⃣ Post Details

// Title → <Input /> → title (string) ✅

// Description → <Textarea /> → description (string) ✅

// 2️⃣ Subject Domains

// Multi-select → domains (array of strings / domain IDs)

// Keep <CustomMultiSelect /> as you have. Ensure the selected values send domainIds to API.

// 3️⃣ Grading Criteria

// Select grading type → gradeType (numeric | letter | rubric | checklist | weightedRubric | passFail)

// Use <CustomSelect />

// After selecting a grading type, render additional inputs dynamically for the criteria values.
// Example:

// Numeric: <Input type="number" /> for max points

// Letter: input ranges (A: 90-100, B: 80-89)

// Rubric / WeightedRubric: list of criteria → each with label, maxPoints, weight (optional)

// Checklist / PassFail: boolean or checklist items

// 4️⃣ File Uploads

// <FileUploader /> → maps to uploads in Post API

// Accept: image/*,.pdf,.docx ✅

// Store uploaded file URLs in the payload when creating a post.
