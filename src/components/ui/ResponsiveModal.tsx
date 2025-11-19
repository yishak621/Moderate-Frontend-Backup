"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import BottomSheet from "./BottomSheet";

interface ResponsiveModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  maxHeight?: string;
  nested?: boolean; // For modal over modal scenarios
  zIndex?: number; // Custom z-index for the modal
  width?: string; // Custom width for the modal
}

export default function ResponsiveModal({
  isOpen,
  onOpenChange,
  children,
  title,
  showCloseButton = true,
  maxHeight = "90vh",
  nested = false,
  zIndex,
  width,
}: ResponsiveModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
        title={title}
        showCloseButton={showCloseButton}
        maxHeight={maxHeight}
      >
        {children}
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Content
        panelClassName={nested ? "bg-white rounded-lg shadow-xl" : ""}
        className={nested ? "z-[100]" : ""}
        zIndex={zIndex}
        width={width}
      >
        {children}
      </Modal.Content>
    </Modal>
  );
}
