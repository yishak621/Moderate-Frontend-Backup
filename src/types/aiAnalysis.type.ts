export type AIAnalysisStatus = "queued" | "processing" | "completed" | "failed";

export type AIAnalysisType =
  | "grader"
  | "content_detector"
  | "similarity_checker";

// Aggregated result type - one row per document with all AI results
export interface DocumentAIAnalysisRow {
  uploadId: string;
  fileName: string;
  fileUrl: string;
  postId?: string;
  postTitle?: string;
  documentRunAIGrader?: boolean;
  documentRunAIDetector?: boolean;
  documentRunAISimilarityChecker?: boolean;
  aiResults?: {
    grader?: {
      rawResult?: any;
      metadata?: any;
      createdAt?: string;
    };
    detector?: {
      rawResult?: any;
      metadata?: any;
      createdAt?: string;
    };
    similarityChecker?: {
      rawResult?: any;
      metadata?: any;
      createdAt?: string;
    };
  };
  graderResult?: {
    id: string;
    status: string;
    result?: any;
    isPublic: boolean;
  };
  detectorResult?: {
    id: string;
    status: string;
    result?: any;
    isPublic: boolean;
  };
  similarityResult?: {
    id: string;
    status: string;
    result?: any;
    isPublic: boolean;
  };
}

export interface AIAnalysisResult {
  id: string;
  uploadId: string;
  fileName: string;
  fileUrl: string;
  fileIcon?: string;
  postId?: string;
  postTitle?: string;
  status: AIAnalysisStatus;
  type: AIAnalysisType;
  result?: any;
  error?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
}

export interface AIAnalysisStats {
  totalProcessed: number;
  inQueue: number;
  completed: number;
  failed: number;
}

export interface AllAIAnalysisStats {
  grader: AIAnalysisStats;
  detector: AIAnalysisStats;
  similarity: AIAnalysisStats;
}

export interface AIAnalysisTableFilters {
  search?: string;
  status?: AIAnalysisStatus;
  type?: AIAnalysisType;
  page?: number;
  limit?: number;
}

export interface AIAnalysisTableResponse {
  data: AIAnalysisResult[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface AIGraderResult {
  score?: number;
  feedback?: string;
  criteria?: Array<{
    name: string;
    score: number;
    maxScore: number;
    feedback: string;
  }>;
  suggestions?: string[];
}

export interface AIContentDetectorResult {
  aiProbability: number; // 0-100
  confidence: number; // 0-100
  flaggedSections?: Array<{
    text: string;
    probability: number;
    startIndex: number;
    endIndex: number;
  }>;
  overallAssessment: "likely_human" | "likely_ai" | "uncertain";
}

export interface AISimilarityResult {
  similarityScore: number; // 0-100
  matchedDocuments?: Array<{
    documentId: string;
    documentName: string;
    similarity: number;
    matchedSections: Array<{
      text: string;
      similarity: number;
    }>;
  }>;
  overallAssessment:
    | "original"
    | "similar"
    | "highly_similar"
    | "potential_plagiarism";
}
