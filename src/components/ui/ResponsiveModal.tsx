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
}

export default function ResponsiveModal({
  isOpen,
  onOpenChange,
  children,
  title,
  showCloseButton = true,
  maxHeight = "90vh",
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
      <Modal.Content>{children}</Modal.Content>
    </Modal>
  );
}
