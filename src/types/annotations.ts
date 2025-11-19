export interface AnnotationUser {
  id: string;
  name: string;
  shortname?: string | null;
  profilePictureUrl?: string | null;
}

export interface ImageAnnotationComment {
  id: string;
  annotationId: string;
  comment: string;
  createdAt: string;
  createdBy?: AnnotationUser;
  author?: AnnotationUser;
}

export interface ImageAnnotation {
  id: string;
  postId: string;
  uploadId: string;
  xPercent: number;
  yPercent: number;
  createdAt: string;
  createdBy?: AnnotationUser;
  author?: AnnotationUser;
  comments?: ImageAnnotationComment[];
  repliesCount?: number;
}

export interface CreateAnnotationPayload {
  comment: string;
  xPercent: number;
  yPercent: number;
}

export interface CreateAnnotationCommentPayload {
  comment: string;
}
