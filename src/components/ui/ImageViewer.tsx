"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ResponsiveModal from "@/components/ui/ResponsiveModal";

type ImageViewerProps = {
  src: string | null | undefined;
  isOpen: boolean;
  onClose: () => void;
  alt?: string;
};

export default function ImageViewer({
  src,
  isOpen,
  onClose,
  alt = "image",
}: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef<number | null>(null);

  const clampScale = (s: number) => Math.min(5, Math.max(0.5, s));

  const resetView = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newScale = clampScale(scale * 1.2);
    const scaleRatio = newScale / scale;
    const newTranslateX = centerX - (centerX - translate.x) * scaleRatio;
    const newTranslateY = centerY - (centerY - translate.y) * scaleRatio;
    setScale(newScale);
    setTranslate({ x: newTranslateX, y: newTranslateY });
  }, [scale, translate]);

  const zoomOut = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newScale = clampScale(scale / 1.2);
    const scaleRatio = newScale / scale;
    const newTranslateX = centerX - (centerX - translate.x) * scaleRatio;
    const newTranslateY = centerY - (centerY - translate.y) * scaleRatio;
    setScale(newScale);
    setTranslate({ x: newTranslateX, y: newTranslateY });
  }, [scale, translate]);

  useEffect(() => {
    if (!isOpen) resetView();
  }, [isOpen, resetView]);

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    // zoom towards cursor
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const delta = -e.deltaY;
    const zoomIntensity = 0.0015;
    const newScale = clampScale(scale * (1 + delta * zoomIntensity));

    const scaleRatio = newScale / scale;
    const newTranslateX = cursorX - (cursorX - translate.x) * scaleRatio;
    const newTranslateY = cursorY - (cursorY - translate.y) * scaleRatio;

    setScale(newScale);
    setTranslate({ x: newTranslateX, y: newTranslateY });
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsPanning(true);
    lastPos.current = {
      x: e.clientX - translate.x,
      y: e.clientY - translate.y,
    };
  };
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isPanning) return;
    e.preventDefault();
    setTranslate({
      x: e.clientX - lastPos.current.x,
      y: e.clientY - lastPos.current.y,
    });
  };
  const endPan = () => setIsPanning(false);

  // Accept both DOM Touch and React.Touch by using a structural type
  const distance = (
    t1: { clientX: number; clientY: number },
    t2: { clientX: number; clientY: number }
  ) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.hypot(dx, dy);
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (e.touches.length === 2) {
      lastTouchDist.current = distance(e.touches[0], e.touches[1]);
    } else if (e.touches.length === 1) {
      setIsPanning(true);
      lastPos.current = {
        x: e.touches[0].clientX - translate.x,
        y: e.touches[0].clientY - translate.y,
      };
    }
  };
  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (e.touches.length === 2 && lastTouchDist.current) {
      e.preventDefault();
      const newDist = distance(e.touches[0], e.touches[1]);
      const rect = containerRef.current?.getBoundingClientRect();
      const centerX =
        (e.touches[0].clientX + e.touches[1].clientX) / 2 - (rect?.left ?? 0);
      const centerY =
        (e.touches[0].clientY + e.touches[1].clientY) / 2 - (rect?.top ?? 0);
      const factor = newDist / lastTouchDist.current;
      const newScale = clampScale(scale * factor);
      const scaleRatio = newScale / scale;
      const newTranslateX = centerX - (centerX - translate.x) * scaleRatio;
      const newTranslateY = centerY - (centerY - translate.y) * scaleRatio;
      setScale(newScale);
      setTranslate({ x: newTranslateX, y: newTranslateY });
      lastTouchDist.current = newDist;
    } else if (e.touches.length === 1 && isPanning) {
      e.preventDefault();
      setTranslate({
        x: e.touches[0].clientX - lastPos.current.x,
        y: e.touches[0].clientY - lastPos.current.y,
      });
    }
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (!isPanning) lastTouchDist.current = null;
    setIsPanning(false);
  };

  const onDoubleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (scale !== 1) {
      resetView();
    } else {
      // quick zoom-in on double click
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      const newScale = 2;
      const scaleRatio = newScale / scale;
      const newTranslateX = cursorX - (cursorX - translate.x) * scaleRatio;
      const newTranslateY = cursorY - (cursorY - translate.y) * scaleRatio;
      setScale(newScale);
      setTranslate({ x: newTranslateX, y: newTranslateY });
    }
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onOpenChange={(open) => (!open ? onClose() : null)}
      title=""
      zIndex={150}
      width="w-1/2"
    >
      <div className="relative w-full h-[70vh] sm:h-[80vh] bg-black rounded-xl overflow-hidden touch-pan-y">
        {/* Image container with zoom/pan */}
        <div
          ref={containerRef}
          className="relative w-full h-full cursor-grab active:cursor-grabbing"
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={endPan}
          onMouseLeave={endPan}
          onDoubleClick={onDoubleClick}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={src || ""}
            alt={alt}
            className="select-none pointer-events-none max-w-none"
            draggable={false}
            style={
              {
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transformOrigin: "0 0",
                userSelect: "none",
                WebkitUserDrag: "none",
              } as React.CSSProperties
            }
          />
        </div>
        {/* Fixed buttons - outside zoom container, static position */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs pointer-events-none">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 pointer-events-auto"
              onClick={resetView}
            >
              Reset
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 border border-white/20 pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={zoomOut}
              disabled={scale <= 0.5}
              aria-label="Zoom out"
            >
              −
            </button>
            <div className="px-2 py-1 rounded-md bg-white/10 border border-white/20 pointer-events-auto min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 border border-white/20 pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={zoomIn}
              disabled={scale >= 5}
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
          <button
            className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 pointer-events-auto"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
