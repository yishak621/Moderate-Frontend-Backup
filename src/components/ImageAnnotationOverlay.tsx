"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { MessageCircle, X, Loader2, ZoomIn } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import {
  useImageAnnotations,
  useCreateAnnotation,
  useAnnotationComments,
  useCreateAnnotationComment,
} from "@/hooks/useAnnotations";
import { ImageAnnotation } from "@/types/annotations";
import UserAvatar from "@/components/UserAvatar";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import ResponsiveModal from "@/components/ui/ResponsiveModal";
import { timeAgo } from "@/lib/timeAgo";

const CHAT_CURSOR_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%231D4ED8' stroke='%231D4ED8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M21 11.5c0 4.4-3.8 8-8.5 8-1 .01-2-.16-3-.5L3 21l2-4.5c-.7-1.1-1.1-2.4-1.1-3.7 0-4.4 3.8-8 8.5-8S21 7.1 21 11.5Z'/><circle cx='8' cy='11.5' r='1.2'/><circle cx='12' cy='11.5' r='1.2'/><circle cx='16' cy='11.5' r='1.2'/></svg>`
);
const CHAT_CURSOR_STYLE = `url("data:image/svg+xml,${CHAT_CURSOR_SVG}") 2 2, pointer`;

type Variant = "desktop" | "mobile";

interface ImageAnnotationOverlayProps {
  postId: string;
  uploadId?: string;
  imageUrl: string;
  canCreateAnnotations: boolean;
  onOpenImageViewer?: () => void;
  variant?: Variant;
}

type DraftPin = {
  xPercent: number;
  yPercent: number;
};

export default function ImageAnnotationOverlay({
  postId,
  uploadId,
  imageUrl,
  canCreateAnnotations,
  onOpenImageViewer,
  variant = "desktop",
}: ImageAnnotationOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draftPinBoxRef = useRef<HTMLDivElement | null>(null);
  const [annotationAccessDenied, setAnnotationAccessDenied] = useState(false);
  const [draftPin, setDraftPin] = useState<DraftPin | null>(null);
  const [draftComment, setDraftComment] = useState("");
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<
    string | null
  >(null);
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
  const [isDraftPinModalOpen, setIsDraftPinModalOpen] = useState(false);
  const [replyValue, setReplyValue] = useState("");

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
        "Unable to load image annotations right now.";
      toast.error(message);
    }
  }, [annotationsError]);

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

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canCreateAnnotations || !uploadId) return;
    if (!containerRef.current) return;

    // If draft pin is open, handle closing (only on desktop, mobile is handled by modal backdrop)
    if (draftPin && variant === "desktop" && draftPinBoxRef.current) {
      const boxRect = draftPinBoxRef.current.getBoundingClientRect();
      const clickX = event.clientX;
      const clickY = event.clientY;

      // Check if click is outside the draft pin box
      if (
        clickX < boxRect.left ||
        clickX > boxRect.right ||
        clickY < boxRect.top ||
        clickY > boxRect.bottom
      ) {
        // Click is outside the box, close it
        handleCloseDraftPin();
        return;
      }
      // Click is inside the box, don't do anything (let the box handle it)
      return;
    }

    // No draft pin open, create a new one
    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
    setDraftPin({
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
        toast.error("You do not have permission to comment on this image.");
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

  const renderAnnotationThread = () => {
    if (!selectedAnnotation) return null;

    const commentsToRender =
      threadComments && threadComments.length > 0
        ? threadComments
        : selectedAnnotation.comments || [];

    const body = (
      <div className="flex flex-col h-full z-[60]">
        {/* Header only shown on desktop, mobile uses modal title */}
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
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#0C0C0C]">
                        {commentAuthor?.name || "Teacher"}
                      </p>
                      <span className="text-[11px] text-[#9CA3AF]">
                        {timeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-[#374151] whitespace-pre-wrap mt-0.5 break-words">
                      {comment.comment}
                    </p>
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

  const containerShapeClass =
    variant === "desktop" ? "rounded-3xl" : "rounded-[24.5px]";
  const imageClass =
    variant === "desktop"
      ? "w-full h-[90vh] object-contain bg-black/5"
      : "w-full h-auto max-h-[60vh] object-contain bg-black/5";

  // Click handler should be active when placement is enabled OR when draft pin is open on desktop (to detect outside clicks)
  // On mobile, when modal is open, the backdrop handles closing, so we don't need the container click handler
  const shouldHandleClicks =
    isPlacementEnabled ||
    (canCreateAnnotations &&
      draftPin !== null &&
      (variant === "desktop" || !isDraftPinModalOpen));

  return (
    <>
      <div
        ref={containerRef}
        onClick={shouldHandleClicks ? handleImageClick : undefined}
        className={clsx(
          "relative w-full bg-black/5 overflow-visible",
          containerShapeClass
        )}
        style={isPlacementEnabled ? { cursor: CHAT_CURSOR_STYLE } : undefined}
      >
        {/* Image wrapper with overflow-hidden to contain the image */}
        <div
          className={clsx(
            "relative w-full overflow-hidden",
            containerShapeClass
          )}
        >
          <Image
            src={imageUrl}
            alt="Post attachment"
            width={1200}
            height={1600}
            className={imageClass}
            priority={false}
            unoptimized
            onClick={(event) => {
              if (!canCreateAnnotations || annotationsUnavailable) {
                onOpenImageViewer?.();
                event.stopPropagation();
              }
            }}
          />

          {onOpenImageViewer && (
            <button
              type="button"
              className="absolute top-4 left-4 z-20 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-sm text-gray-700 shadow-md hover:bg-white"
              onClick={(event) => {
                event.stopPropagation();
                onOpenImageViewer();
              }}
            >
              <ZoomIn className="w-4 h-4" />
              View full size
            </button>
          )}
        </div>

        {/* Annotation overlays - outside image wrapper to prevent clipping */}
        {!annotationAccessDenied && uploadId && (
          <>
            {isLoadingAnnotations && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 pointer-events-none">
                <Loader2 className="w-6 h-6 animate-spin text-[#368FFF]" />
              </div>
            )}

            {annotations.map((annotation) => {
              const replies =
                annotation.repliesCount ?? annotation.comments?.length ?? 1;
              const isActive = annotation.id === selectedAnnotationId;
              return (
                <button
                  key={annotation.id}
                  type="button"
                  className={clsx(
                    "absolute z-[100] -translate-x-1/2 -translate-y-full flex flex-col items-center gap-1",
                    isActive ? "scale-110" : "scale-100"
                  )}
                  style={{
                    left: `${annotation.xPercent}%`,
                    top: `${annotation.yPercent}%`,
                  }}
                  onClick={(event) => handleSelectAnnotation(event, annotation)}
                >
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
                  <span className="text-[11px] font-semibold text-white bg-black/70 px-1.5 py-0.5 rounded-full">
                    {replies}
                  </span>
                </button>
              );
            })}

            {draftPin &&
              (() => {
                const draftPinContent = (
                  <div className="flex flex-col">
                    {/* Only show title on desktop, mobile uses modal title */}
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

                // Mobile: Use modal
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

                // Desktop: Use floating box
                const isNearLeft = draftPin.xPercent < 15;
                const isNearRight = draftPin.xPercent > 85;
                const isNearTop = draftPin.yPercent < 15;

                // Determine horizontal positioning
                let translateX = "-50%"; // Default: center
                if (isNearLeft) {
                  translateX = "0%"; // Show to the right of click
                } else if (isNearRight) {
                  translateX = "-100%"; // Show to the left of click
                }

                // Determine vertical positioning
                const translateY = isNearTop ? "0%" : "-100%"; // Show below if near top, above otherwise

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
              })()}

            {variant === "desktop"
              ? selectedAnnotation && renderAnnotationThread()
              : renderAnnotationThread()}
          </>
        )}
      </div>

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
