import { axiosInstance } from "@/lib/axiosInstance";

export interface UserProfileDomain {
  id: string;
  name: string;
}

export interface UserProfile {
  id: string;
  name: string;
  shortname?: string;
  email: string;
  profilePictureUrl?: string | null;
  role: "TEACHER" | "STUDENT" | "ADMIN";
  joinedAt: string;
  domains?: UserProfileDomain[];
}

export interface UserProfileStats {
  postCount: number;
  gradesGivenCount: number;
  commentsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface UserProfileRelationship {
  isFollowing: boolean;
  isBlocked: boolean;
  isBlockedByThem: boolean;
  canMessage: boolean;
}

export interface UserProfileResponse {
  success: boolean;
  user: UserProfile;
  stats: UserProfileStats;
  relationship: UserProfileRelationship;
}

// Get user public profile
export const getUserProfile = async (userId: string): Promise<UserProfileResponse> => {
  try {
    const res = await axiosInstance.get(`/api/user/profile/${userId}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(
        // @ts-expect-error: might be Axios error with response
        error?.response?.data?.message ||
          error.message ||
          "Failed to fetch user profile"
      );
    } else {
      console.error("Unknown error", error);
      throw new Error("Failed to fetch user profile");
    }
  }
};

