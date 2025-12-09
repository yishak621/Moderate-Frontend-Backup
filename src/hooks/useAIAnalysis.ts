import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAIAnalysisStats,
  getAIAnalysisStatsByType,
  getAIAnalysisResults,
  getAIAnalysisResultsByType,
  getUserDocuments,
  toggleResultVisibility,
  downloadResult,
} from "@/services/aiAnalysis.service";
import {
  AIAnalysisTableFilters,
  AIAnalysisType,
} from "@/types/aiAnalysis.type";
import toast from "react-hot-toast";

/**
 * AI Analysis statistics for all tools
 */
export function useAIAnalysisStats() {
  return useQuery({
    queryKey: ["ai-analysis-stats"],
    queryFn: getAIAnalysisStats,
    staleTime: 60000,
    refetchInterval: 60000,
  });
}

/**
 *   AI Analysis statistics for a specific tool
 */
export function useAIAnalysisStatsByType(type: AIAnalysisType) {
  return useQuery({
    queryKey: ["ai-analysis-stats", type],
    queryFn: () => getAIAnalysisStatsByType(type),
    staleTime: 60000,
    refetchInterval: 60000,
  });
}

/**
 *  All user's AI Analysis results
 */
export function useAIAnalysisResults(filters: AIAnalysisTableFilters) {
  return useQuery({
    queryKey: ["ai-analysis-results", filters],
    queryFn: () => getAIAnalysisResults(filters),
    staleTime: 80000,
  });
}

/**
 *  AI Analysis results for a specific tool
 */
export function useAIAnalysisResultsByType(
  type: AIAnalysisType,
  filters: AIAnalysisTableFilters
) {
  return useQuery({
    queryKey: ["ai-analysis-results", type, filters],
    queryFn: () => getAIAnalysisResultsByType(type, filters),
    staleTime: 600000, // 10 minutes
    refetchInterval: 600000, // 10 minutes (600000 ms)
  });
}

/**
 *  All user's uploaded documents
 */
export function useUserDocuments(filters: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["user-documents", filters],
    queryFn: () => getUserDocuments(filters),
    staleTime: 60000,
  });
}

/**
 *  Toggle result visibility
 */
export function useToggleResultVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resultId,
      isPublic,
    }: {
      resultId: string;
      isPublic: boolean;
    }) => toggleResultVisibility(resultId, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-analysis-results"] });
      toast.success("Visibility updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update visibility"
      );
    },
  });
}

/**
 *  Download result
 */
export function useDownloadResult() {
  return useMutation({
    mutationFn: downloadResult,
    onSuccess: (blob, resultId) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-analysis-result-${resultId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to download result"
      );
    },
  });
}
