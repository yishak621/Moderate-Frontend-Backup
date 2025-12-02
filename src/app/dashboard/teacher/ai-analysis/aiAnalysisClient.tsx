"use client";

import { useRouter } from "next/navigation";
import { Brain, FileCheck, Search, Sparkles, Loader } from "lucide-react";
import Button from "@/components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import {
  useAIAnalysisStats,
  useAIAnalysisResults,
  useUserDocuments,
  useToggleResultVisibility,
  useDownloadResult,
} from "@/hooks/useAIAnalysis";
import SearchInput from "@/components/ui/SearchInput";
import DataTable from "@/components/table/Table";
import { getAIAnalysisColumns } from "./columns";
import { DocumentAIAnalysisRow } from "@/types/aiAnalysis.type";
import ResponsiveModal from "@/components/ui/ResponsiveModal";

const aiTools = [
  {
    id: "ai-grader",
    title: "AI Grader",
    description:
      "Automatically grade student submissions using AI-powered analysis",
    icon: Sparkles,
    href: "/dashboard/teacher/ai-analysis/ai-grader",
    color: "bg-blue-500",
    type: "grader" as const,
  },
  {
    id: "ai-content-detector",
    title: "AI Content Detector",
    description: "Detect AI-generated content in student submissions",
    icon: FileCheck,
    href: "/dashboard/teacher/ai-analysis/ai-content-detector",
    color: "bg-purple-500",
    type: "content_detector" as const,
  },
  {
    id: "ai-similarity-checker",
    title: "AI Similarity Checker",
    description: "Check for similarity and plagiarism across submissions",
    icon: Search,
    href: "/dashboard/teacher/ai-analysis/ai-similarity-checker",
    color: "bg-green-500",
    type: "similarity_checker" as const,
  },
];

export default function AIAnalysisClient() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] = useState<React.FC<any> | null>(
    null
  );
  const [modalProps, setModalProps] = useState<any>({});
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: allStats, isLoading: isStatsLoading } = useAIAnalysisStats();
  const { data: documentsData, isLoading: isDocumentsLoading } =
    useUserDocuments({
      search: debouncedSearch,
      page,
      limit: 10,
    });

  const {
    data: resultsData,
    isLoading: isResultsLoading,
    isFetching: isResultsFetching,
  } = useAIAnalysisResults({
    search: debouncedSearch,
    page,
    limit: 10,
  });

  const { mutate: toggleVisibility } = useToggleResultVisibility();
  const { mutate: downloadResult } = useDownloadResult();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const aggregatedRows: DocumentAIAnalysisRow[] = useMemo(() => {
    const documentsMap = new Map<string, DocumentAIAnalysisRow>();

    if (documentsData?.uploads) {
      documentsData.uploads.forEach((doc) => {
        documentsMap.set(doc.id, {
          uploadId: doc.id,
          fileName: doc.fileName,
          fileUrl: doc.fileUrl,
          postId: doc.postId || undefined,
          postTitle: undefined,
          documentRunAIGrader: doc.documentRunAIGrader || false,
          documentRunAIDetector: doc.documentRunAIDetector || false,
          documentRunAISimilarityChecker:
            doc.documentRunAISimilarityChecker || false,
          aiResults: (doc as any).aiResults || undefined,
        });
      });
    }

    if (resultsData?.data) {
      resultsData.data.forEach((result) => {
        const key = result.uploadId;
        if (!documentsMap.has(key)) {
          documentsMap.set(key, {
            uploadId: result.uploadId,
            fileName: result.fileName,
            fileUrl: result.fileUrl,
            postId: result.postId,
            postTitle: result.postTitle,
            documentRunAIGrader: false,
            documentRunAIDetector: false,
            documentRunAISimilarityChecker: false,
          });
        }

        const row = documentsMap.get(key)!;
        if (result.type === "grader") {
          row.graderResult = {
            id: result.id,
            status: result.status,
            result: result.result,
            isPublic: result.isPublic,
          };
        } else if (result.type === "content_detector") {
          row.detectorResult = {
            id: result.id,
            status: result.status,
            result: result.result,
            isPublic: result.isPublic,
          };
        } else if (result.type === "similarity_checker") {
          row.similarityResult = {
            id: result.id,
            status: result.status,
            result: result.result,
            isPublic: result.isPublic,
          };
        }
      });
    }

    return Array.from(documentsMap.values());
  }, [documentsData, resultsData]);

  const handleOpenModal = (component: React.FC<any>, props: any = {}) => {
    setModalComponent(() => component);
    setModalProps({
      ...props,
      onClose: () => setOpen(false),
    });
    setOpen(true);
  };

  const columns = getAIAnalysisColumns(
    handleOpenModal,
    (resultId: string, isPublic: boolean) => {
      toggleVisibility({ resultId, isPublic });
    },
    (resultId: string) => {
      downloadResult(resultId);
    }
  );

  const totalDocuments = documentsData?.meta?.total || 0;
  const totalPages = documentsData?.meta?.lastPage || 1;
  const hasNextPage = documentsData?.meta?.lastPage
    ? page < documentsData.meta.lastPage
    : false;
  const hasPreviousPage = page > 1;

  const graderStats = allStats?.grader || {
    totalProcessed: 0,
    inQueue: 0,
    completed: 0,
    failed: 0,
  };
  const detectorStats = allStats?.detector || {
    totalProcessed: 0,
    inQueue: 0,
    completed: 0,
    failed: 0,
  };
  const similarityStats = allStats?.similarity || {
    totalProcessed: 0,
    inQueue: 0,
    completed: 0,
    failed: 0,
  };

  return (
    <div className="w-full  mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            AI Analysis Tools
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Leverage AI-powered tools to enhance your grading and content analysis
          workflow
        </p>
      </div>

      {/* AI Tools Grid with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {aiTools.map((tool) => {
          const Icon = tool.icon;
          let stats = { totalProcessed: 0, inQueue: 0 };
          if (tool.type === "grader") stats = graderStats;
          else if (tool.type === "content_detector") stats = detectorStats;
          else if (tool.type === "similarity_checker") stats = similarityStats;

          return (
            <div
              key={tool.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(tool.href)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className={`${tool.color} p-3 rounded-lg shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Stats Display */}
                <div className="text-center py-4 border-t border-gray-200">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {isStatsLoading ? (
                      <Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    ) : (
                      stats.totalProcessed
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Documents Processed
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.inQueue} in queue
                  </p>
                </div>

                <Button
                  variant="black"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(tool.href);
                  }}
                >
                  Open Tool
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              All Documents ({totalDocuments})
            </h2>
            <p className="text-sm text-gray-600">
              View and manage all your documents and AI analysis results
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <SearchInput
              label="Search Documents"
              placeholder="Search by document name or post ID"
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={setSearchTerm}
              onClear={() => {
                setSearchTerm("");
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isDocumentsLoading || isResultsLoading ? (
            <div className="flex flex-col items-center py-14 gap-4">
              <Loader className="animate-spin text-blue-600" size={34} />
              <p className="text-gray-600 text-sm">Loading documents...</p>
            </div>
          ) : aggregatedRows.length > 0 ? (
            <>
              <DataTable data={aggregatedRows} columns={columns} />
              {isResultsFetching && !isResultsLoading && (
                <div className="text-center py-2 text-sm text-gray-500">
                  Updating...
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
              <Brain className="text-gray-300 mb-4" size={40} />
              <p className="text-gray-900 text-lg font-medium">
                No results found
              </p>
              <p className="text-gray-600 text-sm max-w-md mt-1">
                Upload documents and run AI analysis to see results here.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={
                !hasPreviousPage || isDocumentsLoading || isResultsLoading
              }
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!hasNextPage || isDocumentsLoading || isResultsLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          About AI Analysis Tools
        </h3>
        <p className="text-sm text-gray-700">
          Our AI-powered analysis tools help you grade more efficiently, detect
          AI-generated content, and identify similarities across student
          submissions. All tools use advanced machine learning models to provide
          accurate and reliable results.
        </p>
      </div>

      {/* Result Modal */}
      <ResponsiveModal isOpen={open} onOpenChange={setOpen}>
        {ModalComponent && <ModalComponent {...modalProps} />}
      </ResponsiveModal>
    </div>
  );
}
