// types/grading.ts
export type Criterion = {
  key: string;
  label: string;
  maxPoints: number;
};

export type WeightedCriterion = Criterion & { weight: number }; // weight as fraction or percent

export type LetterRange = { letter: string; min: number; max: number };

export type GradeResult = {
  totalScore: number | undefined;
  maxScore: number | undefined;
  percent: number | undefined;
  letter?: string | null;
  extra?: Record<string, any>;
};

export type RubricCriteria = {
  key: string;
  label: string;
  maxPoints: number;
  rubricCriteria: any;
};

export type GradeTemplateRubricProps = {
  criteria?: RubricCriteria;
  totalRange?: { min: number; max: number };
  postId: string;
  gradingTemplate: any;
};

export type RubricCriteriaItemProps = {
  name: string;
  value: number | string;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
};
