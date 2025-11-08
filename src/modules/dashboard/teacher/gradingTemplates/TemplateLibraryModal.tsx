"use client";

import { useState, useMemo } from "react";
import { useGradingTemplates, useDeleteGradingTemplate } from "@/hooks/useUser";
import { GradingTemplate, GradingTemplateType } from "@/types/gradingTemplate";
import Button from "@/components/ui/Button";
import { Search, Trash2, Star, StarOff, Loader2 } from "lucide-react";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";
import SuspenseLoading from "@/components/ui/SuspenseLoading";

interface TemplateLibraryModalProps {
  onSelectTemplate: (template: GradingTemplate) => void;
  onClose: () => void;
  filterByType?: GradingTemplateType;
}

export default function TemplateLibraryModal({
  onSelectTemplate,
  onClose,
  filterByType,
}: TemplateLibraryModalProps) {
  const { gradingTemplates, isGradingTemplatesLoading } = useGradingTemplates();
  const { deleteTemplateAsync, isDeletingTemplateLoading } =
    useDeleteGradingTemplate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<
    GradingTemplateType | "all"
  >(filterByType || "all");

  const filteredTemplates = useMemo(() => {
    let filtered = gradingTemplates;

    // Filter by type
    if (selectedTypeFilter !== "all") {
      filtered = filtered.filter((t) => t.gradingType === selectedTypeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [gradingTemplates, selectedTypeFilter, searchQuery]);

  const handleDelete = async (templateId: string, templateName: string) => {
    if (!confirm(`Are you sure you want to delete "${templateName}"?`)) {
      return;
    }

    try {
      await deleteTemplateAsync(templateId);
      toast.success("Template deleted successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete template"
      );
    }
  };

  const getTypeLabel = (type: GradingTemplateType) => {
    const labels: Record<GradingTemplateType, string> = {
      numeric: "Numeric",
      letter: "Letter Grade",
      rubric: "Rubric",
      weightedRubric: "Weighted Rubric",
      checklist: "Checklist",
      passFail: "Pass/Fail",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: GradingTemplateType) => {
    const colors: Record<GradingTemplateType, string> = {
      numeric: "bg-blue-100 text-blue-700",
      letter: "bg-purple-100 text-purple-700",
      rubric: "bg-green-100 text-green-700",
      weightedRubric: "bg-orange-100 text-orange-700",
      checklist: "bg-pink-100 text-pink-700",
      passFail: "bg-gray-100 text-gray-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const typeFilters: Array<{
    value: GradingTemplateType | "all";
    label: string;
  }> = [
    { value: "all", label: "All Types" },
    { value: "numeric", label: "Numeric" },
    { value: "letter", label: "Letter" },
    { value: "rubric", label: "Rubric" },
    { value: "weightedRubric", label: "Weighted Rubric" },
    { value: "checklist", label: "Checklist" },
    { value: "passFail", label: "Pass/Fail" },
  ];

  return (
    <div className="p-6 max-h-[80vh] flex flex-col bg-white rounded-lg w-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Grading Templates
      </h2>

      {/* Search and Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-15"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedTypeFilter(filter.value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedTypeFilter === filter.value
                  ? "bg-[#368FFF] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {isGradingTemplatesLoading ? (
          <div className="flex items-center justify-center py-12">
            <SuspenseLoading message="Loading templates..." size="sm" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 mb-2">
              {searchQuery || selectedTypeFilter !== "all"
                ? "No templates found matching your criteria"
                : "No templates saved yet"}
            </p>
            <p className="text-sm text-gray-400">
              {searchQuery || selectedTypeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Save a template from the create post form to get started"}
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#368FFF] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {template.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${getTypeColor(
                        template.gradingType
                      )}`}
                    >
                      {getTypeLabel(template.gradingType)}
                    </span>
                  </div>
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {template.usageCount !== undefined && (
                      <span>Used {template.usageCount} times</span>
                    )}
                    <span>
                      {new Date(template.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    className="text-sm px-4"
                  >
                    Load
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDelete(template.id, template.name)}
                    disabled={isDeletingTemplateLoading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete template"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-4 border-t border-gray-200 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="w-full"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
