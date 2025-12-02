"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, FileText, Loader } from "lucide-react";
import Button from "@/components/ui/Button";
import FileUploader from "@/components/FileUploader";
import SearchInput from "@/components/ui/SearchInput";
import DataTable from "@/components/table/Table";
import { getAISimilarityCheckerColumns } from "./columns";
import {
  useAIAnalysisStatsByType,
  useAIAnalysisResultsByType,
  useUserDocuments,
} from "@/hooks/useAIAnalysis";
import Modal from "@/components/ui/Modal";
import AISimilarityResultModal from "../modals/AISimilarityResultModal";
import RunAISimilarityModal from "../modals/RunAISimilarityModal";

export default function AISimilarityCheckerClient() {
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

  // Fetch stats
  const { data: stats, isLoading: isStatsLoading } =
    useAIAnalysisStatsByType("similarity_checker");

  // Fetch user documents
  const { data: documentsData, isLoading: isDocumentsLoading } =
    useUserDocuments({
      search: debouncedSearch,
      page,
      limit: 10,
    });

  // Fetch AI Similarity Checker results
  const {
    data: resultsData,
    isLoading: isResultsLoading,
    isFetching: isResultsFetching,
  } = useAIAnalysisResultsByType("similarity_checker", {
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

  // Merge documents with their AI results
  // Show ALL documents, with AI results if available
  const mergedData = useMemo(() => {
    if (!documentsData?.uploads) return [];

    // New backend shape: resultsData.data = [{ id, aiResult, ... }]
    const resultsMap = new Map(
      (resultsData?.data || []).map((r: any) => [r.id, r])
    );

    return documentsData.uploads.map((doc: any) => {
      const resEntry = resultsMap.get(doc.id) as any | undefined;
      const aiResult = resEntry?.aiResult;

      return {
        id: resEntry?.id || doc.id,
        uploadId: doc.id, // Use id as uploadId
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        postId: doc.postId || undefined,
        postTitle: undefined, // Not in response
        status: aiResult ? "completed" : "queued",
        // This is what the similarity result modal reads
        result: aiResult?.rawResult,
        error: undefined,
        isPublic: false,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        type: "similarity_checker" as const,
        hasTextContent: !!doc.textContent,
        hasEmbedding: !!doc.embedding,
        documentRunAISimilarityChecker: doc.documentRunAISimilarityChecker,
      };
    });
  }, [documentsData, resultsData]);

  const handleOpenModal = (component: React.FC<any>, props: any = {}) => {
    setModalComponent(() => component);
    setModalProps(props);
    setOpen(true);
  };

  const [runModalOpen, setRunModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    fileName: string;
  } | null>(null);

  const handleRunAnalysis = (uploadId: string, fileName: string) => {
    setSelectedDocument({ id: uploadId, fileName });
    setRunModalOpen(true);
  };

  const columns = getAISimilarityCheckerColumns(
    handleOpenModal,
    handleRunAnalysis
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
          <Search className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            AI Similarity Checker
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Compare student submissions to detect similarities and potential
          plagiarism using AI-powered analysis
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
          Upload Documents to Compare
        </h2>
        <FileUploader
          label="Upload Multiple Documents"
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
              View and run AI similarity checking on your uploaded documents
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
              <Loader className="animate-spin text-green-600" size={34} />
              <p className="text-gray-600 text-sm">Loading documents...</p>
            </div>
          ) : mergedData.length > 0 ? (
            <>
              <DataTable
                data={mergedData}
                columns={columns}
                getRowClassName={(row) => {
                  const status = row.original.status;
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
                Upload documents to start using AI similarity checking.
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
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          How It Works
        </h3>
        <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
          <li>Upload multiple documents to compare</li>
          <li>Click &quot;Run Analysis&quot; to start similarity detection</li>
          <li>AI analyzes content using semantic similarity detection</li>
          <li>Receive similarity scores and highlighted matching sections</li>
          <li>Export detailed reports for review</li>
        </ul>
      </div>

      {/* Modal */}
      <Modal isOpen={open} onOpenChange={setOpen}>
        {ModalComponent && <ModalComponent {...modalProps} />}
      </Modal>

      {/* Run AI Similarity Checker Modal */}
      {selectedDocument && (
        <RunAISimilarityModal
          isOpen={runModalOpen}
          onOpenChange={setRunModalOpen}
          documentId={selectedDocument.id}
          fileName={selectedDocument.fileName}
          allDocuments={mergedData.map((doc) => ({
            id: doc.uploadId,
            fileName: doc.fileName,
            uploadId: doc.uploadId,
          }))}
        />
      )}
    </div>
  );
}
