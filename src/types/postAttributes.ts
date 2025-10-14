import { User } from "@/app/types/user";
import { Comment, Grade } from "./Post";
import { JwtPayload } from "jwt-decode";

export interface UploadAttributes {
  id: string;
  fileName: string;
  fileUrl: string;
  postId?: string;
  preview?: string;
  fileType?: string;
  uploadedBy?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
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
  comments: Comment[];
  grades: Grade[];
}

export interface PostCreateInput {
  title: string;
  description?: string;
  domain: string;
  gradingType:
    | "numeric"
    | "letter"
    | "rubric"
    | "weightedRubric"
    | "checklist"
    | "passFail";
  gradingTemplate: Record<string, any>;
  postCreatorGrade: Record<string, any>;
  uploadIds: string[];
  tags?: string[];
  minPoints?: number;
  maxPoints?: number;
}

export interface customJwtPayload extends JwtPayload {
  id: string;
  email?: string;
  role?: string;
}
