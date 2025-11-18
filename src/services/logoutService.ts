import { removeToken } from "./tokenService";
import { queryClient } from "@/lib/queryClient";
import { useUserStore } from "@/store/userStore";
import { useGradeEditStore } from "@/store/gradeEditStore";
import { useUIStore } from "@/store/uiStore";

export const performLogout = () => {
  // 1. Clear React Query cache 
  queryClient.clear();

  // 2. Clear Zustand stores
  useUserStore.getState().clearUser();
  // Clear grade edit state 
  const currentEditingPostId = useGradeEditStore.getState().editingPostId;
  if (currentEditingPostId) {
    useGradeEditStore.getState().clearEditingGrade(currentEditingPostId);
  }
  // Reset UI state 
  useUIStore.getState().closeModal();

  // 3. Clear sessionStorage (grading filters, scroll positions, etc.)
  if (typeof window !== "undefined") {
    sessionStorage.clear();
  }

  // 4. Remove all authentication cookies 
  removeToken();

  
};
