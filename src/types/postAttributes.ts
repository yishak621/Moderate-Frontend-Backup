import { User } from "@/app/types/user";

export interface UploadAttributes {
  id: string;
  fileName: string;
  fileUrl: string;
  postId: string;
  uploadedBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PostAttributes {
  id: string | number;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  uploads: UploadAttributes[];
  post_tags: string[];
  post_status: "draft" | "published" | "archived";
  post_grade_avg: string | number;
  author: User;
}
