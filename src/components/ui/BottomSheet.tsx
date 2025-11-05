"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, createContext, useContext } from "react";

interface BottomSheetContextType {
  close: () => void;
  isOpen: boolean;
}

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export const useBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) {
    // Return a no-op object (for compatibility with useModal)
    return { close: () => {}, isOpen: false as any };
  }
  return ctx;
};

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  maxHeight?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  maxHeight = "90vh",
}: BottomSheetProps) {
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[27px] z-[70] shadow-2xl"
            style={{ maxHeight }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div
                onClick={onClose}
                className="w-12 h-1 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-colors"
              />
            </div>

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-200">
                {title && (
                  <h2 className="text-lg font-semibold text-[#0C0C0C]">{title}</h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <BottomSheetContext.Provider value={{ close: onClose, isOpen }}>
              <div className="overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 80px)` }}>
                {children}
              </div>
            </BottomSheetContext.Provider>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

