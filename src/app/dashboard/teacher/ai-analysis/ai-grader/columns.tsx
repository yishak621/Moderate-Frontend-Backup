"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FileText, Eye, Play, Loader2, FileSearch } from "lucide-react";
import Button from "@/components/ui/Button";
import { AIAnalysisResult, AIAnalysisStatus } from "@/types/aiAnalysis.type";
import AIGraderResultModal from "../modals/AIGraderResultModal";

// Extend the base result type with document flags coming from uploads
type GraderRow = AIAnalysisResult & {
  documentRunAIGrader?: boolean;
};

export function getAIGraderColumns(
  handleOpenModal: (component: React.FC<any>, props?: any) => void,
  handleRunAnalysis: (
    uploadId: string,
    fileName: string,
    postId?: string
  ) => void,
  handleViewDocument: (fileUrl: string, fileName: string, uploadId?: string, postId?: string) => void
): ColumnDef<GraderRow>[] {
  const getStatusColor = (status: AIAnalysisStatus) => {
    switch (status) {
      case "queued":
      case "processing":
        return "bg-yellow-50 border-yellow-200";
      case "completed":
        return "bg-green-50 border-green-200";
      case "failed":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return [
    {
      accessorKey: "fileIcon",
      header: "",
      cell: () => (
        <div className="flex items-center justify-center w-8 h-8 ">
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
      cell: ({ row }) => (
        <div>
          {row.original.postId ? (
            <span className="text-sm text-blue-600">{row.original.postId}</span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        // Only show a positive status when the grader has actually run.
        const isGraded = row.original.documentRunAIGrader;

        if (!isGraded) {
          return <span className="text-xs text-gray-400">Not processed</span>;
        }

        return (
          <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
            Completed
          </span>
        );
      },
    },
    {
      id: "viewDocument",
      header: "View Document",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              className="text-gray-600 hover:text-gray-700 text-sm"
              onClick={() =>
                handleViewDocument(
                  row.original.fileUrl,
                  row.original.fileName,
                  row.original.uploadId,
                  row.original.postId
                )
              }
            >
              <FileSearch className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        );
      },
    },
    {
      id: "viewResult",
      header: "View Result",
      cell: ({ row }) => {
        // Show "View" when the document has been processed by the grader,
        // even if we don't yet have a rich result payload.
        const hasResult =
          row.original.documentRunAIGrader ||
          (row.original.status === "completed" && row.original.result);

        return (
          <div className="flex items-center justify-center">
            {hasResult ? (
              <Button
                variant="secondary"
                className="text-blue-600 hover:text-blue-700 text-sm"
                onClick={() =>
                  handleOpenModal(AIGraderResultModal, {
                    result: row.original,
                  })
                }
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            ) : (
              <span className="text-gray-400 text-sm">-</span>
            )}
          </div>
        );
      },
    },
    {
      id: "runAnalysis",
      header: "Run Analysis",
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            className="text-green-600 hover:text-green-700 text-sm"
            onClick={() =>
              handleRunAnalysis(
                row.original.uploadId,
                row.original.fileName,
                row.original.postId
              )
            }
          >
            <>
              <Play className="w-4 h-4 mr-1" />
              Run
            </>
          </Button>
        );
      },
    },
  ];
}
