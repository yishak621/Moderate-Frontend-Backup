export type GradingTemplateType =
  | "numeric"
  | "letter"
  | "rubric"
  | "weightedRubric"
  | "checklist"
  | "passFail";

export interface NumericCriteria {
  min: number;
  max: number;
}

export interface LetterRange {
  letter: string;
  min: number;
  max: number;
}

export interface RubricCriterion {
  label: string;
  maxPoints: number;
  minPoints?: number;
  weight?: number; // For weighted rubric
}

export interface GradingTemplateCriteria {
  numericCriteria?: NumericCriteria;
  letterRanges?: LetterRange[];
  rubricCriteria?: RubricCriterion[];
  checklistItems?: string[];
  // passFail doesn't need criteria
}

export interface GradingTemplate {
  id: string;
  name: string;
  description?: string;
  gradingType: GradingTemplateType;
  criteria: GradingTemplateCriteria;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  usageCount?: number;
}

export interface CreateGradingTemplateInput {
  name: string;
  description?: string;
  type: GradingTemplateType;
  criteria: GradingTemplateCriteria;
}

export interface UpdateGradingTemplateInput {
  name?: string;
  description?: string;
  criteria?: GradingTemplateCriteria;
  isFavorite?: boolean;
}

