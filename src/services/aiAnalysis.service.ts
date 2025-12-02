import { axiosInstance } from "@/lib/axiosInstance";
import {
  AIAnalysisTableResponse,
  AIAnalysisTableFilters,
  AIAnalysisStats,
  AllAIAnalysisStats,
  AIAnalysisResult,
  AIAnalysisType,
} from "@/types/aiAnalysis.type";
import {
  GradingTemplateCriteria,
  GradingTemplateType,
} from "@/types/gradingTemplate";

/**
 * Get AI Analysis statistics for all tools
 */
export const getAIAnalysisStats = async (): Promise<AllAIAnalysisStats> => {
  try {
    const res = await axiosInstance.get("/api/ai/analysis/stats");
    return res.data;
  } catch (error) {
    console.error("Error fetching AI analysis stats:", error);
    throw error;
  }
};

/**
 * Get AI Analysis statistics for a specific tool
 * NOTE: There is no dedicated `/api/ai/analysis/stats/:type` endpoint in the backend.
 * We derive simple stats from the existing `/results/:type` endpoint instead.
 */
export const getAIAnalysisStatsByType = async (
  type: AIAnalysisType
): Promise<AIAnalysisStats> => {
  try {
    // Fetch with a tiny page size – we only care about meta.total
    const res = await getAIAnalysisResultsByType(type, {
      page: 1,
      limit: 1,
    });

    const totalProcessed = res.meta.total || 0;

    // Backend does not yet expose queue/failed counts – approximate with simple values
    const stats: AIAnalysisStats = {
      totalProcessed,
      inQueue: 0,
      completed: totalProcessed,
      failed: 0,
    };

    return stats;
  } catch (error) {
    console.error(`Error deriving AI analysis stats for ${type}:`, error);
    throw error;
  }
};

/**
 * Get all AI Analysis results with filters
 */
export const getAIAnalysisResults = async (
  filters: AIAnalysisTableFilters
): Promise<AIAnalysisTableResponse> => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.type) params.append("type", filters.type);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const res = await axiosInstance.get(
      `/api/ai/analysis/results?${params.toString()}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching AI analysis results:", error);
    throw error;
  }
};

/**
 * Get AI Analysis results for a specific tool
 */
export const getAIAnalysisResultsByType = async (
  type: AIAnalysisType,
  filters: AIAnalysisTableFilters
): Promise<AIAnalysisTableResponse> => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const res = await axiosInstance.get(
      `/api/ai/analysis/results/${type}?${params.toString()}`
    );

    const payload = res.data;

    // New backend shape: { success, message, meta, documents: [...] }
    if (Array.isArray(payload?.documents)) {
      return {
        data: payload.documents,
        meta: payload.meta,
      };
    }

    // Fallback for legacy shape
    return payload;
  } catch (error) {
    console.error(`Error fetching AI analysis results for ${type}:`, error);
    throw error;
  }
};

/**
 * Get user's uploaded documents (for running AI analysis)
 * Returns all documents from posts and user uploads
 */
export const getUserDocuments = async (
  filters: { search?: string; page?: number; limit?: number }
): Promise<{
  status: string;
  uploads: Array<{
    id: string;
    fileName: string;
    postId: string | null;
    fileUrl: string;
    uploadedBy: string;
    textContent: string | null;
    embedding: number[] | null;
    documentRunAIGrader: boolean;
    documentRunAIDetector: boolean;
    documentRunAISimilarityChecker: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}> => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const res = await axiosInstance.get(
      `/api/user/documents?${params.toString()}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching user documents:", error);
    throw error;
  }
};

/**
 * Get upload embedding status
 */
export const getUploadEmbeddingStatus = async (
  uploadId: string
): Promise<{
  success: boolean;
  upload: {
    id: string;
    fileName: string;
    fileUrl: string;
    hasTextContent: boolean;
    hasEmbedding: boolean;
    textContentLength?: number;
  };
}> => {
  try {
    const res = await axiosInstance.get(`/api/ai/upload/${uploadId}/status`);
    return res.data;
  } catch (error) {
    console.error("Error fetching upload embedding status:", error);
    throw error;
  }
};

/**
 * Run AI Grader analysis
 */
export const runAIGrader = async (payload: {
  documentId: string;
  prompt: string;
  gradingTemplateId?: string;
  gradingType?: GradingTemplateType;
  criteria?: GradingTemplateCriteria;
}): Promise<any> => {
  try {
    const res = await axiosInstance.post(`/api/ai/grader`, payload);
    return res.data;
  } catch (error) {
    console.error("Error running AI grader:", error);
    throw error;
  }
};

/**
 * Run AI Content Detector analysis
 */
export const runAIDetector = async (payload: {
  documentId: string;
  prompt: string;
}): Promise<any> => {
  try {
    const res = await axiosInstance.post(`/api/ai/detector`, payload);
    return res.data;
  } catch (error) {
    console.error("Error running AI detector:", error);
    throw error;
  }
};

/**
 * Run AI Similarity Checker analysis
 */
export const runAISimilarityChecker = async (payload: {
  documentIds: string[];
  prompt: string;
}): Promise<any> => {
  try {
    const res = await axiosInstance.post(`/api/ai/similarity-checker`, payload);
    return res.data;
  } catch (error) {
    console.error("Error running AI similarity checker:", error);
    throw error;
  }
};

/**
 * Toggle result visibility (public/private)
 */
export const toggleResultVisibility = async (
  resultId: string,
  isPublic: boolean
): Promise<AIAnalysisResult> => {
  try {
    const res = await axiosInstance.patch(`/api/ai/analysis/results/${resultId}/visibility`, {
      isPublic,
    });
    return res.data;
  } catch (error) {
    console.error("Error toggling result visibility:", error);
    throw error;
  }
};

/**
 * Download result
 */
export const downloadResult = async (resultId: string): Promise<Blob> => {
  try {
    const res = await axiosInstance.get(`/api/ai/analysis/results/${resultId}/download`, {
      responseType: "blob",
    });
    return res.data;
  } catch (error) {
    console.error("Error downloading result:", error);
    throw error;
  }
};

