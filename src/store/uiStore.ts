// store/uiStore.ts
import { create } from "zustand";

interface UIState {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;

  modalType: string | null;
  openModal: (type: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarExpanded: true,
  toggleSidebar: () =>
    set((s) => ({ isSidebarExpanded: !s.isSidebarExpanded })),

  modalType: null,
  openModal: (type) => set({ modalType: type }),
  closeModal: () => set({ modalType: null }),
}));
