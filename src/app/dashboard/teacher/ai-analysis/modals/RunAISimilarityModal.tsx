"use client";

import { useState, useMemo } from "react";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
import Button from "@/components/ui/Button";
import { Search, Loader2, X } from "lucide-react";
import { runAISimilarityChecker } from "@/services/aiAnalysis.service";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface RunAISimilarityModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  documentId: string;
  fileName: string;
  allDocuments?: Array<{
    id: string;
    fileName: string;
    uploadId: string;
  }>;
}

export default function RunAISimilarityModal({
  isOpen,
  onOpenChange,
  documentId,
  fileName,
  allDocuments = [],
}: RunAISimilarityModalProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const queryClient = useQueryClient();

  const availableDocuments = useMemo(() => {
    return allDocuments.filter((doc) => doc.id !== documentId);
  }, [allDocuments, documentId]);

  const toggleDocument = (docId: string) => {
    setSelectedDocumentIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const handleRun = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (selectedDocumentIds.length === 0) {
      toast.error("Please select at least one document to compare");
      return;
    }

    setIsRunning(true);
    try {
      await runAISimilarityChecker({
        documentIds: [documentId, ...selectedDocumentIds],
        prompt: prompt.trim(),
      });
      toast.success("AI Similarity Checker started successfully!");
      queryClient.invalidateQueries({ queryKey: ["ai-analysis-results"] });
      queryClient.invalidateQueries({
        queryKey: ["ai-similarity-checker-results"],
      });
      queryClient.invalidateQueries({ queryKey: ["user-documents"] });
      queryClient.invalidateQueries({ queryKey: ["ai-analysis-stats"] });
      onOpenChange(false);
      setPrompt("");
      setSelectedDocumentIds([]);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to start AI Similarity Checker"
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Run AI Similarity Checker"
    >
      <div className="bg-[#FDFDFD] w-full min-w-0 sm:min-w-[551px] max-h-screen overflow-y-scroll scrollbar-hide p-6 sm:p-10 rounded-[27px] flex flex-col">
        {/* Header */}
        <div className="flex flex-row justify-between mb-6">
          <div className="flex flex-col gap-1.5">
            <p className="text-xl text-[#0c0c0c] font-medium">
              Run AI Similarity Checker
            </p>
            <p className="text-base font-normal text-[#717171]">
              Check similarity between {fileName} and other documents
            </p>
          </div>
          <div onClick={() => onOpenChange(false)}>
            <X
              width={22}
              height={22}
              className="text-[#000000] cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900">Comparing:</p>
            <p className="text-sm text-blue-700">{fileName}</p>
          </div>

          {/* Document Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Documents to Compare{" "}
              <span className="text-red-500">*</span>
            </label>
            {availableDocuments.length === 0 ? (
              <p className="text-sm text-gray-500">
                No other documents available for comparison
              </p>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-2">
                {availableDocuments.map((doc) => (
                  <label
                    key={doc.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDocumentIds.includes(doc.id)}
                      onChange={() => toggleDocument(doc.id)}
                      disabled={isRunning}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">
                      {doc.fileName}
                    </span>
                  </label>
                ))}
              </div>
            )}
            {selectedDocumentIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedDocumentIds.map((docId) => {
                  const doc = availableDocuments.find((d) => d.id === docId);
                  return (
                    <span
                      key={docId}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                    >
                      {doc?.fileName}
                      <button
                        onClick={() => toggleDocument(docId)}
                        disabled={isRunning}
                        className="hover:text-green-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Prompt <span className="text-red-500">*</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter instructions for similarity checking (e.g., 'Check for plagiarism and similarity between these documents. Identify matching sections')"
              className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              disabled={isRunning}
            />
            <p className="text-xs text-gray-500">
              Provide clear instructions for how the AI should check similarity
            </p>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleRun}
            disabled={
              isRunning ||
              !prompt.trim() ||
              selectedDocumentIds.length === 0 ||
              availableDocuments.length === 0
            }
            className="w-full"
            variant="primary"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Generate Similarity Check
              </>
            )}
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
