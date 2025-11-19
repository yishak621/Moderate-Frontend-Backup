import { axiosInstance } from "@/lib/axiosInstance";
import {
  CreateAnnotationCommentPayload,
  CreateAnnotationPayload,
  ImageAnnotation,
  ImageAnnotationComment,
} from "@/types/annotations";

const mapComment = (comment: any): ImageAnnotationComment => {
  if (!comment) return comment;
  return {
    ...comment,
    comment: comment.comment ?? comment.body ?? "",
    createdBy: comment.createdBy || comment.author,
    author: comment.author || comment.createdBy,
  };
};

const mapAnnotation = (annotation: any): ImageAnnotation => {
  if (!annotation) return annotation;
  return {
    ...annotation,
    createdBy: annotation.createdBy || annotation.author,
    comments: Array.isArray(annotation.comments)
      ? annotation.comments.map(mapComment)
      : undefined,
  };
};

export const fetchAnnotations = async (
  postId: string,
  uploadId?: string
): Promise<ImageAnnotation[]> => {
  if (!postId) {
    throw new Error("postId is required to fetch annotations");
  }

  const response = await axiosInstance.get(
    `/api/annotations/posts/${postId}`,
    {
      params: uploadId ? { uploadId } : undefined,
    }
  );

  const payload = response.data?.annotations ?? response.data ?? [];
  return Array.isArray(payload) ? payload.map(mapAnnotation) : payload;
};

export const createAnnotation = async ({
  postId,
  uploadId,
  payload,
}: {
  postId: string;
  uploadId: string;
  payload: CreateAnnotationPayload;
}): Promise<ImageAnnotation> => {
  if (!postId || !uploadId) {
    throw new Error("postId and uploadId are required to create annotation");
  }

  const response = await axiosInstance.post(
    `/api/annotations/posts/${postId}/uploads/${uploadId}`,
    payload
  );

  const annotationData = response.data?.annotation ?? response.data;
  return mapAnnotation(annotationData);
};

export const fetchAnnotationComments = async (
  annotationId: string
): Promise<ImageAnnotationComment[]> => {
  if (!annotationId) {
    throw new Error("annotationId is required to fetch comments");
  }

  const response = await axiosInstance.get(
    `/api/annotations/${annotationId}/comments`
  );

  const payload = response.data?.comments ?? response.data ?? [];
  return Array.isArray(payload) ? payload.map(mapComment) : payload;
};

export const createAnnotationComment = async ({
  annotationId,
  payload,
}: {
  annotationId: string;
  payload: CreateAnnotationCommentPayload;
}): Promise<ImageAnnotationComment> => {
  if (!annotationId) {
    throw new Error("annotationId is required to create comment");
  }

  const response = await axiosInstance.post(
    `/api/annotations/${annotationId}/comments`,
    payload
  );

  const commentData = response.data?.comment ?? response.data;
  return mapComment(commentData);
};

