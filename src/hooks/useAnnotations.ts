"use client";

import {
  createAnnotation,
  createAnnotationComment,
  fetchAnnotationComments,
  fetchAnnotations,
  updateAnnotationComment,
  deleteAnnotationComment,
} from "@/services/annotation.service";
import {
  CreateAnnotationPayload,
  CreateAnnotationCommentPayload,
  ImageAnnotation,
  ImageAnnotationComment,
} from "@/types/annotations";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const annotationQueryKeys = {
  all: ["image-annotations"] as const,
  list: (postId?: string | null, uploadId?: string | null) =>
    [...annotationQueryKeys.all, postId, uploadId] as const,
  comments: (annotationId?: string | null) =>
    [...annotationQueryKeys.all, "comments", annotationId] as const,
};

export const useImageAnnotations = (
  postId?: string,
  uploadId?: string,
  enabled = true
) =>
  useQuery<ImageAnnotation[]>({
    queryKey: annotationQueryKeys.list(postId, uploadId),
    queryFn: () => fetchAnnotations(postId!, uploadId),
    enabled: Boolean(postId && uploadId && enabled),
    staleTime: 30 * 1000,
  });

export const useAnnotationComments = (
  annotationId?: string,
  enabled = true
) =>
  useQuery<ImageAnnotationComment[]>({
    queryKey: annotationQueryKeys.comments(annotationId),
    queryFn: () => fetchAnnotationComments(annotationId!),
    enabled: Boolean(annotationId && enabled),
    staleTime: 15 * 1000,
  });

export const useCreateAnnotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      uploadId,
      payload,
    }: {
      postId: string;
      uploadId: string;
      payload: CreateAnnotationPayload;
    }) => createAnnotation({ postId, uploadId, payload }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: annotationQueryKeys.list(variables.postId, variables.uploadId),
      });
    },
  });
};

export const useCreateAnnotationComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      annotationId,
      payload,
    }: {
      annotationId: string;
      payload: CreateAnnotationCommentPayload;
    }) => createAnnotationComment({ annotationId, payload }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: annotationQueryKeys.comments(variables.annotationId),
      });
      queryClient.invalidateQueries({
        queryKey: annotationQueryKeys.all,
      });
    },
  });
};

export const useUpdateAnnotationComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      annotationId,
      commentId,
      payload,
    }: {
      annotationId: string;
      commentId: string;
      payload: { comment: string };
    }) => updateAnnotationComment({ annotationId, commentId, payload }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: annotationQueryKeys.comments(variables.annotationId),
      });
      queryClient.invalidateQueries({
        queryKey: annotationQueryKeys.all,
      });
    },
  });
};

export const useDeleteAnnotationComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      annotationId,
      commentId,
    }: {
      annotationId: string;
      commentId: string;
    }) => deleteAnnotationComment({ annotationId, commentId }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: annotationQueryKeys.comments(variables.annotationId),
      });
      queryClient.invalidateQueries({
        queryKey: annotationQueryKeys.all,
      });
    },
  });
};

