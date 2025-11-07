import { create } from "zustand";

interface GradeEditState {
  editingPostId: string | null;
  isEditingGrade: (postId: string) => boolean;
  setEditingGrade: (postId: string, editing: boolean) => void;
  clearEditingGrade: (postId: string) => void;
}

export const useGradeEditStore = create<GradeEditState>((set, get) => ({
  editingPostId: null,

  isEditingGrade: (postId: string) => {
    return get().editingPostId === postId;
  },

  setEditingGrade: (postId: string, editing: boolean) => {
    if (editing) {
      set({ editingPostId: postId });
    } else {
      // Only clear if it's the same post
      if (get().editingPostId === postId) {
        set({ editingPostId: null });
      }
    }
  },

  clearEditingGrade: (postId: string) => {
    if (get().editingPostId === postId) {
      set({ editingPostId: null });
    }
  },
}));

