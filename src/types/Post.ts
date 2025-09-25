// types/Post.ts
export type Upload = {
  id: string;
  fileName: string;
  fileUrl: string;
};

export type Grade = {
  id: string;
  grade: string; // e.g. "7"
  postId: string;
  gradedBy: string;
  createdAt: string;
};

export type Comment = {
  id: string;
  comment: string;
  postId: string;
  commentedBy: string;
  createdAt: string;
};

export type Author = {
  id: string;
  name: string;
};

export type PostType = {
  id: string;
  title: string;
  description: string;
  uploads: Upload[];
  grades: Grade[];
  comments: Comment[];
  author: Author;
  createdAt: string;
  tags?: string[];
  postGradeAvg?: number;
  postStatus: string;
};
