"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FileText, Eye, Play, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { AIAnalysisResult, AIAnalysisStatus } from "@/types/aiAnalysis.type";
import AIContentDetectorResultModal from "../modals/AIContentDetectorResultModal";

import RunAIDetectorModal from "../modals/RunAIDetectorModal";

export function getAIContentDetectorColumns(
  handleOpenModal: (component: React.FC<any>, props?: any) => void,
  handleRunAnalysis: (uploadId: string, fileName: string) => void
): ColumnDef<AIAnalysisResult>[] {
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
        // Backend doesn't send real queue status yet, so only mark documents
        // that have a detector result as completed.
        const hasResult = !!row.original.result;

        if (!hasResult) {
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
      id: "viewResult",
      header: "View Result",
      cell: ({ row }) => {
        const hasResult = !!row.original.result;

        return (
          <div className="flex items-center justify-center">
            {hasResult ? (
              <Button
                variant="secondary"
                className="text-purple-600 hover:text-purple-700 text-sm"
                onClick={() =>
                  handleOpenModal(AIContentDetectorResultModal, {
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
              handleRunAnalysis(row.original.uploadId, row.original.fileName)
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

