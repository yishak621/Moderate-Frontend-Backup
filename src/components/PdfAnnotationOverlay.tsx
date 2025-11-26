"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
// @ts-expect-error pdfjs legacy build does not ship TypeScript declarations
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf";
import type {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/types/src/display/api";
import { MessageCircle, X, Loader2, Trash2, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import {
  useImageAnnotations,
  useCreateAnnotation,
  useAnnotationComments,
  useCreateAnnotationComment,
  useUpdateAnnotationComment,
  useDeleteAnnotationComment,
} from "@/hooks/useAnnotations";
import { ImageAnnotation } from "@/types/annotations";
import UserAvatar from "@/components/UserAvatar";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
import { timeAgo } from "@/lib/timeAgo";
import { decoded } from "@/lib/currentUser";

const CHAT_CURSOR_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%231D4ED8' stroke='%231D4ED8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M21 11.5c0 4.4-3.8 8-8.5 8-1 .01-2-.16-3-.5L3 21l2-4.5c-.7-1.1-1.1-2.4-1.1-3.7 0-4.4 3.8-8 8.5-8S21 7.1 21 11.5Z'/><circle cx='8' cy='11.5' r='1.2'/><circle cx='12' cy='11.5' r='1.2'/><circle cx='16' cy='11.5' r='1.2'/></svg>`
);
const CHAT_CURSOR_STYLE = `url("data:image/svg+xml,${CHAT_CURSOR_SVG}") 2 2, pointer`;

const waitForNextFrame = () =>
  new Promise<void>((resolve) => {
    if (
      typeof window === "undefined" ||
      typeof requestAnimationFrame === "undefined"
    ) {
      resolve();
      return;
    }
    requestAnimationFrame(() => resolve());
  });

type Variant = "desktop" | "mobile";

interface PdfAnnotationOverlayProps {
  postId: string;
  uploadId?: string;
  fileUrl: string;
  canCreateAnnotations: boolean;
  variant?: Variant;
}

type DraftPin = {
  pageNumber: number;
  xPercent: number;
  yPercent: number;
};

const PDF_WORKER_SRC = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

if (typeof window !== "undefined") {
  GlobalWorkerOptions.workerSrc =
    GlobalWorkerOptions.workerSrc || PDF_WORKER_SRC;
}

export default function PdfAnnotationOverlay({
  postId,
  uploadId,
  fileUrl,
  canCreateAnnotations,
  variant = "desktop",
}: PdfAnnotationOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draftPinBoxRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const [viewerWidth, setViewerWidth] = useState<number | undefined>(undefined);
  const [annotationAccessDenied, setAnnotationAccessDenied] = useState(false);
  const [draftPin, setDraftPin] = useState<DraftPin | null>(null);
  const [draftComment, setDraftComment] = useState("");
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<
    string | null
  >(null);
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
  const [isDraftPinModalOpen, setIsDraftPinModalOpen] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentValue, setEditCommentValue] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [isDocumentLoading, setIsDocumentLoading] = useState(true);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set());

  const registerCanvas = useCallback(
    (pageNumber: number) => (canvas: HTMLCanvasElement | null) => {
      if (canvas) {
        canvasRefs.current.set(pageNumber, canvas);
      } else {
        canvasRefs.current.delete(pageNumber);
      }
    },
    []
  );

  const renderPageToCanvas = useCallback(
    async (pageNumber: number, page: PDFPageProxy) => {
      let canvas = canvasRefs.current.get(pageNumber);
      if (!canvas) {
        await waitForNextFrame();
        canvas = canvasRefs.current.get(pageNumber);
      }
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const baseViewport = page.getViewport({ scale: 1 });
      const parentWidth =
        canvas.parentElement?.clientWidth ||
        viewerWidth ||
        viewerRef.current?.clientWidth ||
        baseViewport.width;
      const scale = Math.max(parentWidth / baseViewport.width, 0.1);
      const viewport = page.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      context.clearRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: context,
        viewport,
        canvas,
      } as any).promise;
    },
    [viewerWidth]
  );

  useEffect(() => {
    if (!viewerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setViewerWidth(entry.contentRect.width);
    });
    observer.observe(viewerRef.current);
    return () => observer.disconnect();
  }, []);

  const shouldLoadAnnotations =
    !!postId && !!uploadId && !annotationAccessDenied;

  const {
    data: annotations = [],
    isLoading: isLoadingAnnotations,
    error: annotationsError,
  } = useImageAnnotations(postId, uploadId, shouldLoadAnnotations);

  useEffect(() => {
    if (!annotationsError) return;
    const axiosError = annotationsError as AxiosError | undefined;
    if (axiosError?.response?.status === 403) {
      setAnnotationAccessDenied(true);
    } else if (axiosError) {
      const message =
        (axiosError.response?.data as { message?: string })?.message ||
        "Unable to load annotations right now.";
      toast.error(message);
    }
  }, [annotationsError]);

  useEffect(() => {
    let isCancelled = false;
    if (!fileUrl) return;

    setDocumentError(null);
    setRenderedPages(() => new Set());
    setIsDocumentLoading(true);
    setNumPages(0);

    const loadingTask = getDocument({
      url: fileUrl,
      withCredentials: false,
    });

    loadingTask.promise
      .then(async (pdf: PDFDocumentProxy) => {
        if (isCancelled) return;
        setNumPages(pdf.numPages);
        await waitForNextFrame();

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (isCancelled) break;
          const page = await pdf.getPage(pageNumber);
          if (isCancelled) break;
          await renderPageToCanvas(pageNumber, page);
          if (isCancelled) break;
          setRenderedPages((prev) => {
            const next = new Set(prev);
            next.add(pageNumber);
            return next;
          });
        }

        if (!isCancelled) {
          setIsDocumentLoading(false);
        }
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Could not load PDF document.";
        if (isCancelled) return;
        setDocumentError(message);
        setIsDocumentLoading(false);
      });

    return () => {
      isCancelled = true;
      loadingTask.destroy();
    };
  }, [fileUrl, renderPageToCanvas]);

  const selectedAnnotation: ImageAnnotation | undefined = useMemo(() => {
    if (!selectedAnnotationId) return undefined;
    return annotations.find(
      (annotation) => annotation.id === selectedAnnotationId
    );
  }, [annotations, selectedAnnotationId]);

  const shouldLoadComments =
    !!selectedAnnotationId &&
    (variant === "desktop" ? true : isThreadModalOpen);

  const { data: threadComments = [], isLoading: isLoadingComments } =
    useAnnotationComments(
      selectedAnnotationId ?? undefined,
      shouldLoadComments
    );

  const { mutateAsync: createAnnotation, isPending: isCreatingAnnotation } =
    useCreateAnnotation();
  const { mutateAsync: createAnnotationComment, isPending: isCreatingComment } =
    useCreateAnnotationComment();
  const { mutateAsync: updateAnnotationComment, isPending: isUpdatingComment } =
    useUpdateAnnotationComment();
  const { mutateAsync: deleteAnnotationComment, isPending: isDeletingComment } =
    useDeleteAnnotationComment();

  const handlePageClick = (
    event: React.MouseEvent<HTMLDivElement>,
    pageNumber: number
  ) => {
    if (!canCreateAnnotations || !uploadId) return;
    if (!containerRef.current) return;

    if (draftPin && variant === "desktop" && draftPinBoxRef.current) {
      const boxRect = draftPinBoxRef.current.getBoundingClientRect();
      const clickX = event.clientX;
      const clickY = event.clientY;

      if (
        clickX < boxRect.left ||
        clickX > boxRect.right ||
        clickY < boxRect.top ||
        clickY > boxRect.bottom
      ) {
        handleCloseDraftPin();
        return;
      }
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;

    setDraftPin({
      pageNumber,
      xPercent: Number(xPercent.toFixed(4)),
      yPercent: Number(yPercent.toFixed(4)),
    });
    setDraftComment("");
    setSelectedAnnotationId(null);
    setIsThreadModalOpen(false);
    if (variant === "mobile") {
      setIsDraftPinModalOpen(true);
    }
  };

  const handleSubmitAnnotation = async () => {
    if (!draftPin || !draftComment.trim() || !uploadId) return;
    try {
      await createAnnotation({
        postId,
        uploadId,
        payload: {
          ...draftPin,
          comment: draftComment.trim(),
        },
      });
      toast.success("Annotation added");
      handleCloseDraftPin();
    } catch (error) {
      const axiosError = error as AxiosError | undefined;
      if (axiosError?.response?.status === 403) {
        toast.error("You do not have permission to comment on this file.");
      } else {
        const message =
          (axiosError?.response?.data as { message?: string })?.message ||
          "Could not add annotation. Please try again.";
        toast.error(message);
      }
    }
  };

  const handleSelectAnnotation = (
    event: React.MouseEvent,
    annotation: ImageAnnotation
  ) => {
    event.stopPropagation();
    setDraftPin(null);
    setDraftComment("");
    setSelectedAnnotationId(annotation.id);
    if (variant === "mobile") {
      setIsThreadModalOpen(true);
    }
  };

  const handleCloseThread = () => {
    setSelectedAnnotationId(null);
    setIsThreadModalOpen(false);
    setReplyValue("");
  };

  const handleCloseDraftPin = () => {
    setDraftPin(null);
    setDraftComment("");
    setIsDraftPinModalOpen(false);
  };

  const handleSubmitReply = async () => {
    if (!selectedAnnotationId || !replyValue.trim()) return;
    try {
      await createAnnotationComment({
        annotationId: selectedAnnotationId,
        payload: { comment: replyValue.trim() },
      });
      setReplyValue("");
    } catch (error) {
      const axiosError = error as AxiosError | undefined;
      if (axiosError?.response?.status === 403) {
        toast.error("You do not have permission to reply to this annotation.");
      } else {
        const message =
          (axiosError?.response?.data as { message?: string })?.message ||
          "Could not send reply. Please try again.";
        toast.error(message);
      }
    }
  };

  const handleStartEdit = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditCommentValue(comment.comment || "");
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentValue("");
  };

  const handleSaveEdit = async () => {
    if (!selectedAnnotationId || !editingCommentId || !editCommentValue.trim())
      return;
    try {
      await updateAnnotationComment({
        annotationId: selectedAnnotationId,
        commentId: editingCommentId,
        payload: { comment: editCommentValue.trim() },
      });
      toast.success("Comment updated");
      setEditingCommentId(null);
      setEditCommentValue("");
    } catch (error) {
      const axiosError = error as AxiosError | undefined;
      if (axiosError?.response?.status === 403) {
        toast.error("You do not have permission to edit this comment.");
      } else {
        const message =
          (axiosError?.response?.data as { message?: string })?.message ||
          "Could not update comment. Please try again.";
        toast.error(message);
      }
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDeleteId(commentId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteComment = async () => {
    if (!selectedAnnotationId || !commentToDeleteId) return;
    try {
      await deleteAnnotationComment({
        annotationId: selectedAnnotationId,
        commentId: commentToDeleteId,
      });
      toast.success("Comment deleted");
      setCommentToDeleteId(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      const axiosError = error as AxiosError | undefined;
      if (axiosError?.response?.status === 403) {
        toast.error("You do not have permission to delete this comment.");
      } else {
        const message =
          (axiosError?.response?.data as { message?: string })?.message ||
          "Could not delete comment. Please try again.";
        toast.error(message);
      }
    }
  };

  const renderAnnotationThread = () => {
    if (!selectedAnnotation) return null;

    const commentsToRender =
      threadComments && threadComments.length > 0
        ? threadComments
        : selectedAnnotation.comments || [];

    const body = (
      <div className="flex flex-col h-full z-[60]">
        {variant === "desktop" && (
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-[#0C0C0C]">
                Moderation thread
              </p>
              <p className="text-xs text-[#717171]">
                {selectedAnnotation.createdBy?.name ||
                selectedAnnotation.author?.name
                  ? `Started by ${
                      selectedAnnotation.createdBy?.name ||
                      selectedAnnotation.author?.name
                    }`
                  : "Moderation comments"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseThread}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close moderation thread"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        )}

        <div className="flex-1 min-h-0 max-h-[55vh] overflow-y-auto space-y-3 pr-1 annotation-thread-scroll">
          {isLoadingComments ? (
            <div className="flex items-center justify-center py-6 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading thread...
            </div>
          ) : commentsToRender.length === 0 ? (
            <p className="text-sm text-gray-500">
              Be the first to reply to this moderation comment.
            </p>
          ) : (
            commentsToRender.map((comment) => {
              const commentAuthor = comment.createdBy || comment.author;
              const isCommentAuthor =
                decoded?.id === commentAuthor?.id ||
                decoded?.id === (comment as any).authorId;
              const isEditing = editingCommentId === comment.id;

              return (
                <div
                  key={comment.id}
                  className="flex items-start gap-3 rounded-2xl bg-[#F6F7FB] p-3"
                >
                  <UserAvatar
                    name={commentAuthor?.name}
                    size="sm"
                    profilePictureUrl={commentAuthor?.profilePictureUrl || ""}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#0C0C0C]">
                          {commentAuthor?.name || "Teacher"}
                        </p>
                        <span className="text-[11px] text-[#9CA3AF]">
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                      {isCommentAuthor && !isEditing && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(comment)}
                            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                            aria-label="Edit comment"
                          >
                            <Edit2 size={14} className="text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={isDeletingComment}
                            className="p-1.5 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                            aria-label="Delete comment"
                          >
                            <Trash2 size={14} className="text-red-600" />
                          </button>
                        </div>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="mt-2 space-y-2">
                        <Textarea
                          value={editCommentValue}
                          onChange={(e) => setEditCommentValue(e.target.value)}
                          placeholder="Edit your comment..."
                          className="min-h-[80px] text-sm"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCancelEdit}
                            disabled={isUpdatingComment}
                            className="text-sm h-8 px-3"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={handleSaveEdit}
                            disabled={
                              !editCommentValue.trim() || isUpdatingComment
                            }
                            className="text-sm h-8 px-3"
                          >
                            {isUpdatingComment ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Saving...
                              </span>
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-[#374151] whitespace-pre-wrap mt-0.5 break-words">
                        {comment.comment}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}

          <div className="pt-2 border-t border-gray-100">
            <Textarea
              value={replyValue}
              onChange={(event) => setReplyValue(event.target.value)}
              placeholder="Add a reply..."
              className="min-h-[80px]"
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseThread}
                className="text-sm h-10 px-4"
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={handleSubmitReply}
                disabled={!replyValue.trim() || isCreatingComment}
                className="text-sm"
              >
                {isCreatingComment ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

    if (variant === "mobile") {
      return (
        <ResponsiveModal
          isOpen={isThreadModalOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseThread();
            else setIsThreadModalOpen(open);
          }}
          title="Moderation Thread"
        >
          <div className="p-3">{body}</div>
        </ResponsiveModal>
      );
    }

    return (
      <div className="absolute top-4 right-4 z-[100] w-full max-w-xs lg:max-w-sm bg-white shadow-2xl rounded-2xl border border-gray-100 p-4 max-h-[70vh] flex flex-col overflow-visible">
        {body}
      </div>
    );
  };

  const annotationsUnavailable = annotationAccessDenied || !uploadId;

  const isInteractionOverlayActive =
    Boolean(draftPin) || Boolean(selectedAnnotationId) || isThreadModalOpen;

  const isPlacementEnabled =
    canCreateAnnotations &&
    !annotationsUnavailable &&
    !isInteractionOverlayActive;

  const pageAnnotationsMap = useMemo(() => {
    const map = new Map<number, ImageAnnotation[]>();
    annotations.forEach((annotation) => {
      const page = annotation.pageNumber ?? 1;
      const pageAnnotations = map.get(page) || [];
      pageAnnotations.push(annotation);
      map.set(page, pageAnnotations);
    });
    return map;
  }, [annotations]);

  const renderDraftPin = () => {
    if (!draftPin) return null;
    const draftPinContent = (
      <div className="flex flex-col">
        {variant === "desktop" && (
          <div className="flex items-center justify-between mb-3 sm:mb-2">
            <p className="text-sm sm:text-base font-semibold text-[#0C0C0C]">
              Add Moderation Comment
            </p>
            <button
              type="button"
              onClick={handleCloseDraftPin}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={14} className="text-gray-500" />
            </button>
          </div>
        )}
        <Textarea
          value={draftComment}
          onChange={(event) => setDraftComment(event.target.value)}
          placeholder="Leave a comment for this spot..."
          className="min-h-[100px] sm:min-h-[80px] text-sm sm:text-base"
        />
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-3 sm:mt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCloseDraftPin}
            className="text-sm sm:text-base h-11 sm:h-10 px-4 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmitAnnotation}
            disabled={!draftComment.trim() || isCreatingAnnotation}
            className="text-sm sm:text-base h-11 sm:h-10 w-full sm:w-auto"
          >
            {isCreatingAnnotation ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    );

    if (variant === "mobile") {
      return (
        <ResponsiveModal
          isOpen={isDraftPinModalOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseDraftPin();
            else setIsDraftPinModalOpen(open);
          }}
          title="Add Moderation Comment"
        >
          <div className="p-3 sm:p-4">{draftPinContent}</div>
        </ResponsiveModal>
      );
    }

    const isNearLeft = draftPin.xPercent < 15;
    const isNearRight = draftPin.xPercent > 85;
    const isNearTop = draftPin.yPercent < 15;

    let translateX = "-50%";
    if (isNearLeft) {
      translateX = "0%";
    } else if (isNearRight) {
      translateX = "-100%";
    }

    const translateY = isNearTop ? "0%" : "-100%";

    return (
      <div
        ref={draftPinBoxRef}
        className="absolute z-[100]"
        style={{
          left: `${draftPin.xPercent}%`,
          top: `${draftPin.yPercent}%`,
          transform: `translate(${translateX}, ${translateY})`,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 p-3 sm:p-4 w-[280px] sm:w-64 max-w-[calc(100vw-2rem)]">
          {draftPinContent}
        </div>
      </div>
    );
  };

  const renderPage = (pageNumber: number) => {
    const annotationsForPage = pageAnnotationsMap.get(pageNumber) || [];
    const pageIsRendered = renderedPages.has(pageNumber);

    return (
      <div key={pageNumber} className="relative mb-6">
        <canvas
          ref={registerCanvas(pageNumber)}
          className="block w-full h-auto bg-white rounded-2xl shadow-sm"
        />

        {!pageIsRendered && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#1D4ED8]" />
            <span className="text-sm text-gray-600">Rendering page...</span>
          </div>
        )}

        {!annotationAccessDenied && uploadId && (
          <div
            className="absolute inset-0 z-20"
            style={
              isPlacementEnabled ? { cursor: CHAT_CURSOR_STYLE } : undefined
            }
            onClick={(event) => {
              event.stopPropagation();
              if (isPlacementEnabled || draftPin) {
                handlePageClick(event, pageNumber);
              }
            }}
          >
            {annotationsForPage.map((annotation) => {
              const replies =
                annotation.repliesCount ?? annotation.comments?.length ?? 1;
              const isActive = annotation.id === selectedAnnotationId;
              return (
                <button
                  key={annotation.id}
                  type="button"
                  className={clsx(
                    "absolute -translate-x-1/2 -translate-y-full flex flex-col items-center gap-1",
                    isActive ? "scale-110" : "scale-100"
                  )}
                  style={{
                    left: `${annotation.xPercent}%`,
                    top: `${annotation.yPercent}%`,
                  }}
                  onClick={(event) => handleSelectAnnotation(event, annotation)}
                >
                  <span className="text-[11px] font-semibold text-white bg-black/70 px-1.5 py-0.5 rounded-full">
                    {replies}
                  </span>
                  <span
                    className={clsx(
                      "flex items-center justify-center w-7 h-7 rounded-full shadow-lg border text-xs font-semibold",
                      isActive
                        ? "bg-[#1D4ED8] text-white border-[#1D4ED8]"
                        : "bg-white text-[#1D4ED8] border-white"
                    )}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </span>
                </button>
              );
            })}

            {draftPin?.pageNumber === pageNumber && renderDraftPin()}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        ref={containerRef}
        className={clsx(
          "relative w-full bg-black/5 overflow-y-auto",
          variant === "desktop" ? "rounded-3xl" : "rounded-[24.5px]"
        )}
      >
        <div
          ref={viewerRef}
          className={clsx(
            "relative w-full overflow-hidden",
            variant === "desktop" ? "rounded-3xl" : "rounded-[24.5px]"
          )}
        >
          <div className="px-2 sm:px-4 py-4 max-h-[90vh] overflow-y-auto">
            {documentError && (
              <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-red-500">
                <p>{documentError}</p>
              </div>
            )}

            {!documentError && numPages === 0 && isDocumentLoading && (
              <div className="flex items-center justify-center py-10 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading PDF...
              </div>
            )}

            {!documentError && numPages === 0 && !isDocumentLoading && (
              <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-gray-500">
                <p>Unable to display PDF pages.</p>
              </div>
            )}

            {Array.from({ length: numPages }, (_, index) =>
              renderPage(index + 1)
            )}
          </div>
        </div>

        {isLoadingAnnotations && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-20 pointer-events-none">
            <Loader2 className="w-6 h-6 animate-spin text-[#368FFF]" />
          </div>
        )}

        {variant === "desktop"
          ? selectedAnnotation && renderAnnotationThread()
          : renderAnnotationThread()}
      </div>

      <ResponsiveModal
        isOpen={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) {
            setCommentToDeleteId(null);
          }
        }}
        title="Delete comment?"
        nested
        zIndex={200}
      >
        <div className="p-4 sm:p-5 space-y-4 bg-[#f6f6f6] rounded-2xl">
          <p className="text-sm text-gray-600">
            This comment will be removed from the PDF moderation thread. Are you
            sure you want to continue?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCommentToDeleteId(null);
              }}
              className="h-10 px-4 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDeleteComment}
              disabled={isDeletingComment}
              className="h-10 px-4 text-sm bg-red-600 hover:bg-red-700 disabled:opacity-60"
            >
              {isDeletingComment ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </ResponsiveModal>

      <style jsx>{`
        .annotation-thread-scroll {
          scrollbar-width: auto;
          scrollbar-color: #9ca3af transparent;
        }
        .annotation-thread-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .annotation-thread-scroll::-webkit-scrollbar-track {
          background: rgba(229, 231, 235, 0.6);
          border-radius: 9999px;
        }
        .annotation-thread-scroll::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
          border-radius: 9999px;
          border: 2px solid transparent;
        }
      `}</style>
    </>
  );
}
