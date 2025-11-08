"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSaveGradingTemplate } from "@/hooks/useUser";
import {
  CreateGradingTemplateInput,
  GradingTemplateType,
} from "@/types/gradingTemplate";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

interface SaveTemplateModalProps {
  gradingType: GradingTemplateType;
  criteria: {
    numericCriteria?: { min: number; max: number };
    letterRanges?: Array<{ letter: string; min: number; max: number }>;
    rubricCriteria?: Array<{
      label: string;
      maxPoints: number;
      minPoints?: number;
      weight?: number;
    }>;
    checklistItems?: string[];
  };
  onClose: () => void;
  onSuccess?: () => void;
  onSavingStart?: () => void;
}

export default function SaveTemplateModal({
  gradingType,
  criteria,
  onClose,
  onSuccess,
  onSavingStart,
}: SaveTemplateModalProps) {
  const { saveTemplateAsync, isSavingTemplateLoading } =
    useSaveGradingTemplate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; description?: string }>();

  const onSubmit = async (data: { name: string; description?: string }) => {
    try {
      onSavingStart?.();
      const templateData: CreateGradingTemplateInput = {
        name: data.name,
        description: data.description || undefined,
        type: gradingType,
        criteria,
      };

      await saveTemplateAsync(templateData);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save template"
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg w-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Save Grading Template
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Save this grading configuration as a template for future use.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Input
          label="Template Name"
          placeholder="e.g., Standard Numeric Grading"
          {...register("name", {
            required: "Template name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters",
            },
          })}
          error={errors.name?.message}
        />

        <Textarea
          label="Description (Optional)"
          placeholder="Describe when to use this template..."
          rows={3}
          {...register("description")}
        />

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Template Type:
          </p>
          <p className="text-sm text-gray-600 capitalize">{gradingType}</p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSavingTemplateLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isSavingTemplateLoading}
          >
            {isSavingTemplateLoading ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </form>
    </div>
  );
}
