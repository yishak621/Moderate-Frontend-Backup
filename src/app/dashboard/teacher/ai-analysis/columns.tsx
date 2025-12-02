"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  FileText,
  Eye,
  Download,
  Lock,
  Unlock,
  ExternalLink,
} from "lucide-react";
import Button from "@/components/ui/Button";
import AIGraderResultModal from "./modals/AIGraderResultModal";
import AIContentDetectorResultModal from "./modals/AIContentDetectorResultModal";
import AISimilarityResultModal from "./modals/AISimilarityResultModal";
import {
  AIAnalysisResult,
  DocumentAIAnalysisRow,
} from "@/types/aiAnalysis.type";

export function getAIAnalysisColumns(
  handleOpenModal: (component: React.FC<any>, props?: any) => void,
  toggleVisibility: (resultId: string, isPublic: boolean) => void,
  downloadResult: (resultId: string) => void
): ColumnDef<DocumentAIAnalysisRow>[] {
  return [
    {
      accessorKey: "fileIcon",
      header: "",
      cell: () => (
        <div className="flex items-center justify-center w-8 h-8">
          <FileText className="w-5 h-5 text-gray-500" />
        </div>
      ),
      size: 50,
    },
    {
      accessorKey: "fileName",
      header: "Document Name",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.fileName}>
          {row.original.fileName}
        </div>
      ),
    },
    {
      accessorKey: "postId",
      header: "Post ID",
      cell: ({ row }) => {
        const postId = row.original.postId;
        if (!postId) {
          return <span className="text-sm text-gray-400">-</span>;
        }

        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          const url = `/dashboard/teacher/grading/${postId}`;
          window.open(url, "_blank", "noopener,noreferrer");
        };

        return (
          <button
            onClick={handleClick}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
            title={`Open post ${postId} in new window`}
          >
            <span>{postId}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        );
      },
    },
    {
      id: "graderResult",
      header: "AI Grader",
      cell: ({ row }) => {
        const isProcessed = row.original.documentRunAIGrader === true;
        const graderData =
          row.original.aiResults?.grader || row.original.graderResult;

        if (!isProcessed || !graderData) {
          return <span className="text-gray-400 text-sm">-</span>;
        }

        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          const isNewStructure =
            "rawResult" in graderData || "metadata" in graderData;
          const modalResult: AIAnalysisResult = {
            id: row.original.uploadId,
            uploadId: row.original.uploadId,
            fileName: row.original.fileName,
            fileUrl: row.original.fileUrl,
            postId: row.original.postId,
            status: "completed" as any,
            type: "grader",
            result: isNewStructure
              ? (graderData as any).rawResult
              : (graderData as any).result,
            isPublic: (graderData as any).isPublic || false,
            createdAt: isNewStructure
              ? (graderData as any).createdAt || ""
              : "",
            updatedAt: isNewStructure
              ? (graderData as any).createdAt || ""
              : "",
          };
          handleOpenModal(AIGraderResultModal, { result: modalResult });
        };

        return (
          <div className="flex items-center justify-center">
            <Button
              variant="secondary"
              className="text-blue-600 hover:text-blue-700 text-sm"
              onClick={handleView}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        );
      },
    },
    {
      id: "detectorResult",
      header: "Content Detector",
      cell: ({ row }) => {
        const isProcessed = row.original.documentRunAIDetector === true;
        const detectorData =
          row.original.aiResults?.detector || row.original.detectorResult;

        if (!isProcessed || !detectorData) {
          return <span className="text-gray-400 text-sm">-</span>;
        }

        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          const isNewStructure =
            "rawResult" in detectorData || "metadata" in detectorData;
          const modalResult: AIAnalysisResult = {
            id: row.original.uploadId,
            uploadId: row.original.uploadId,
            fileName: row.original.fileName,
            fileUrl: row.original.fileUrl,
            postId: row.original.postId,
            status: "completed" as any,
            type: "content_detector",
            result: isNewStructure
              ? (detectorData as any).rawResult
              : (detectorData as any).result,
            isPublic: (detectorData as any).isPublic || false,
            createdAt: isNewStructure
              ? (detectorData as any).createdAt || ""
              : "",
            updatedAt: isNewStructure
              ? (detectorData as any).createdAt || ""
              : "",
          };
          handleOpenModal(AIContentDetectorResultModal, {
            result: modalResult,
          });
        };

        return (
          <div className="flex items-center justify-center">
            <Button
              variant="secondary"
              className="text-purple-600 hover:text-purple-700 text-sm"
              onClick={handleView}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        );
      },
    },
    {
      id: "similarityResult",
      header: "Similarity Check",
      cell: ({ row }) => {
        const isProcessed =
          row.original.documentRunAISimilarityChecker === true;
        const similarityData =
          row.original.aiResults?.similarityChecker ||
          row.original.similarityResult;

        if (!isProcessed || !similarityData) {
          return <span className="text-gray-400 text-sm">-</span>;
        }

        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          const isNewStructure =
            "rawResult" in similarityData || "metadata" in similarityData;
          const modalResult: AIAnalysisResult = {
            id: row.original.uploadId,
            uploadId: row.original.uploadId,
            fileName: row.original.fileName,
            fileUrl: row.original.fileUrl,
            postId: row.original.postId,
            status: "completed" as any,
            type: "similarity_checker",
            result: isNewStructure
              ? (similarityData as any).rawResult
              : (similarityData as any).result,
            isPublic: (similarityData as any).isPublic || false,
            createdAt: isNewStructure
              ? (similarityData as any).createdAt || ""
              : "",
            updatedAt: isNewStructure
              ? (similarityData as any).createdAt || ""
              : "",
          };
          handleOpenModal(AISimilarityResultModal, { result: modalResult });
        };

        return (
          <div className="flex items-center justify-center">
            <Button
              variant="secondary"
              className="text-green-600 hover:text-green-700 text-sm"
              onClick={handleView}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        );
      },
    },
    {
      id: "visibility",
      header: "Visibility",
      cell: ({ row }) => {
        const result =
          row.original.graderResult ||
          row.original.detectorResult ||
          row.original.similarityResult;
        if (!result) return <span className="text-gray-400 text-sm">-</span>;

        return (
          <Button
            variant="secondary"
            onClick={() => toggleVisibility(result.id, !result.isPublic)}
            className="flex items-center gap-1 text-sm"
          >
            {result.isPublic ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>Public</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Private</span>
              </>
            )}
          </Button>
        );
      },
    },
    {
      id: "download",
      header: "Download",
      cell: ({ row }) => {
        const result =
          row.original.graderResult ||
          row.original.detectorResult ||
          row.original.similarityResult;
        if (!result) return <span className="text-gray-400 text-sm">-</span>;

        return (
          <Button
            variant="secondary"
            onClick={() => downloadResult(result.id)}
            className="flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
          </Button>
        );
      },
    },
  ];
}
