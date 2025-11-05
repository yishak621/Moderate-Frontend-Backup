"use client";

import { useModal } from "@/components/ui/Modal";
import { useBottomSheet } from "@/components/ui/BottomSheet";

/**
 * Hook that works with both Modal and BottomSheet
 * Calls both hooks and returns the one with active context
 */
export function useResponsiveModal() {
  // Call both hooks (both are safe to call now)
  const modalContext = useModal();
  const bottomSheetContext = useBottomSheet();

  // Return the one that has an active context
  // Priority: BottomSheet first (for mobile), then Modal
  if (bottomSheetContext.isOpen === true) {
    return bottomSheetContext;
  }
  if (modalContext.open === true) {
    return modalContext;
  }

  // If neither is active, return the one with isOpen !== undefined (has context)
  if (bottomSheetContext.isOpen !== undefined) {
    return bottomSheetContext;
  }
  if (modalContext.open !== undefined) {
    return modalContext;
  }

  // Fallback
  return { close: () => {}, isOpen: false };
}
