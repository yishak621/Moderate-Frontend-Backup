"use client";

import { useState, useEffect, useMemo } from "react";
import { Sparkles, FileText, Loader } from "lucide-react";
import Button from "@/components/ui/Button";
import FileUploader from "@/components/FileUploader";
import SearchInput from "@/components/ui/SearchInput";
import DataTable from "@/components/table/Table";
import { getAIGraderColumns } from "./columns";
import {
  useAIAnalysisStatsByType,
  useAIAnalysisResultsByType,
  useUserDocuments,
} from "@/hooks/useAIAnalysis";
import { AIAnalysisStatus } from "@/types/aiAnalysis.type";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
import AIGraderResultModal from "../modals/AIGraderResultModal";
import RunAIGraderModal from "../modals/RunAIGraderModal";
import DocumentViewer from "@/components/ui/DocumentViewer";
import { useQueryClient } from "@tanstack/react-query";
import { isAIGraderEnabled } from "@/utils/featureFlags";
import FeatureUnderDevelopment from "@/components/ui/FeatureUnderDevelopment";

export default function AIGraderClient() {
  // Check if feature is enabled
  if (!isAIGraderEnabled()) {
    return (
      <FeatureUnderDevelopment
        featureName="AI Grader"
        icon={<Sparkles className="w-16 h-16 text-blue-600" />}
        description="AI-powered grading feature is currently under development and will be available soon."
      />
    );
  }
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] = useState<React.FC<any> | null>(
    null
  );
  const [modalProps, setModalProps] = useState<any>({});
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const queryClient = useQueryClient();

  // Fetch stats
  const { data: stats, isLoading: isStatsLoading } =
    useAIAnalysisStatsByType("grader");

  // Fetch user documents
  const { data: documentsData, isLoading: isDocumentsLoading } =
    useUserDocuments({
      search: debouncedSearch,
      page,
      limit: 10,
    });

  // Fetch AI Grader results
  const {
    data: resultsData,
    isLoading: isResultsLoading,
    isFetching: isResultsFetching,
  } = useAIAnalysisResultsByType("grader", {
    search: debouncedSearch,
    page,
    limit: 10,
  });

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Refetch documents/results when new files are uploaded
  useEffect(() => {
    if (!uploadedFiles.length) return;

    // Refetch user's documents list
    queryClient.invalidateQueries({ queryKey: ["user-documents"] });
    // Refetch grader analysis results (all variants)
    queryClient.invalidateQueries({ queryKey: ["ai-analysis-results"] });
  }, [uploadedFiles.length, queryClient]);

  // Merge documents with their AI results
  // Show ALL documents, with AI results if available
  const mergedData = useMemo(() => {
    if (!documentsData?.uploads) return [];

    // New backend shape: resultsData.data = [{ id (uploadId), aiResult, ... }]
    const resultsMap = new Map(
      (resultsData?.data || []).map((r: any) => [r.id, r])
    );

    return documentsData.uploads.map((doc: any) => {
      const resEntry = resultsMap.get(doc.id) as any | undefined;
      const aiResult = resEntry?.aiResult;

      const status: AIAnalysisStatus =
        doc.documentRunAIGrader || aiResult ? "completed" : "queued";

      return {
        id: resEntry?.id || doc.id,
        uploadId: doc.id,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        postId: doc.postId || undefined,
        postTitle: undefined,
        status,
        // This is what the grader result modal reads (gradingResult)
        // Pass the entire aiResult structure which includes rawResult and metadata
        result: aiResult
          ? {
              rawResult: aiResult.rawResult,
              metadata: aiResult.metadata,
            }
          : undefined,
        error: undefined,
        isPublic: false,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        type: "grader" as const,
        hasTextContent: !!doc.textContent,
        hasEmbedding: !!doc.embedding,
        documentRunAIGrader: doc.documentRunAIGrader,
      };
    });
  }, [documentsData, resultsData]);

  const handleOpenModal = (component: React.FC<any>, props: any = {}) => {
    setModalComponent(() => component);
    // Inject a standard onClose handler so result modals can close themselves
    setModalProps({
      ...props,
      onClose: () => setOpen(false),
    });
    setOpen(true);
  };

  const [runModalOpen, setRunModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    fileName: string;
    postId?: string;
  } | null>(null);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [documentViewerProps, setDocumentViewerProps] = useState<{
    fileUrl: string;
    fileName: string;
    uploadId?: string;
    postId?: string;
  } | null>(null);

  const handleRunAnalysis = (
    uploadId: string,
    fileName: string,
    postId?: string
  ) => {
    setSelectedDocument({ id: uploadId, fileName, postId });
    setRunModalOpen(true);
  };

  const handleViewDocument = (
    fileUrl: string,
    fileName: string,
    uploadId?: string,
    postId?: string
  ) => {
    setDocumentViewerProps({
      fileUrl,
      fileName,
      uploadId,
      postId,
    });
    setDocumentViewerOpen(true);
  };

  const columns = getAIGraderColumns(
    handleOpenModal,
    handleRunAnalysis,
    handleViewDocument
  ) as any;

  const totalDocuments = documentsData?.meta?.total || 0;
  const totalPages = documentsData?.meta?.lastPage || 1;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const processedCount = stats?.totalProcessed || 0;
  const queueCount = stats?.inQueue || 0;

  return (
    <div className="w-full  mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            AI Grader
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Upload student submissions to get AI-powered grading suggestions and
          feedback
        </p>
      </div>

      {/* Stats Display */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-4">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {isStatsLoading ? (
              <Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            ) : (
              processedCount
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">Documents Processed</p>
          <p className="text-xs text-gray-500">{queueCount} in queue</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Upload Submissions
        </h2>
        <FileUploader
          label="Upload Student Submissions"
          accept=".pdf,.doc,.docx,.txt"
          multiple={true}
          onUploadIdsChange={setUploadedFiles}
          onLoadingChange={setIsProcessing}
        />
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              My Documents ({totalDocuments})
            </h2>
            <p className="text-sm text-gray-600">
              View and run AI grading on your uploaded documents
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
          {isDocumentsLoading ? (
            <div className="flex flex-col items-center py-14 gap-4">
              <Loader className="animate-spin text-blue-600" size={34} />
              <p className="text-gray-600 text-sm">Loading documents...</p>
            </div>
          ) : mergedData.length > 0 ? (
            <>
              <DataTable
                data={mergedData}
                columns={columns}
                getRowClassName={(row) => {
                  const status = row.original.status as AIAnalysisStatus;
                  if (status === "queued" || status === "processing")
                    return "bg-yellow-50";
                  if (status === "completed") return "bg-green-50";
                  if (status === "failed") return "bg-red-50";
                  return "";
                }}
              />
              {isResultsFetching && !isResultsLoading && (
                <div className="text-center py-2 text-sm text-gray-500">
                  Updating...
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
              <FileText className="text-gray-300 mb-4" size={40} />
              <p className="text-gray-900 text-lg font-medium">
                No documents found
              </p>
              <p className="text-gray-600 text-sm max-w-md mt-1">
                Upload documents to start using AI grading.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPreviousPage || isDocumentsLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!hasNextPage || isDocumentsLoading}
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
          How It Works
        </h3>
        <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
          <li>Upload student submissions (PDF, DOC, DOCX, or TXT)</li>
          <li>Click &quot;Run Analysis&quot; to start AI grading</li>
          <li>AI analyzes the content and provides grading suggestions</li>
          <li>Review results and adjust grades as needed</li>
          <li>Export results or apply grades directly</li>
        </ul>
      </div>

      {/* Result Modal */}
      <ResponsiveModal isOpen={open} onOpenChange={setOpen}>
        {ModalComponent && <ModalComponent {...modalProps} />}
      </ResponsiveModal>

      {/* Run AI Grader Modal */}
      {selectedDocument && (
        <RunAIGraderModal
          isOpen={runModalOpen}
          onOpenChange={setRunModalOpen}
          documentId={selectedDocument.id}
          fileName={selectedDocument.fileName}
          postId={selectedDocument.postId}
        />
      )}

      {/* Document Viewer Modal */}
      {documentViewerProps && (
        <DocumentViewer
          fileUrl={documentViewerProps.fileUrl}
          fileName={documentViewerProps.fileName}
          isOpen={documentViewerOpen}
          onClose={() => {
            setDocumentViewerOpen(false);
            setDocumentViewerProps(null);
          }}
          uploadId={documentViewerProps.uploadId}
          postId={documentViewerProps.postId}
        />
      )}
    </div>
  );
}
