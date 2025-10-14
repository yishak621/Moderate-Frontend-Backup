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

// Grading types
export type GradingCriterion = {
  key: string;
  label: string;
  maxPoints: number;
};

export type LetterGradeBand = {
  letter: string;
  min: number;
  max: number;
};

export type GradingRange = {
  min: number;
  max: number;
};

export type GradingLogic = {
  type: string; // e.g. "rubric", "numeric", "passFail"
  criteria?: GradingCriterion[];
  letterGrades?: LetterGradeBand[];
  total?: GradingRange;
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
  gradingLogic?: GradingLogic;
};

export type GradeData = {
  gradeType?: string;
  grade: {
    numeric?: number;
    [key: string]: any;
  };
  gradeTemplateId?: string;
  criteria?: Record<string, any>;
  comment?: string;
};
