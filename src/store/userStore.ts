import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  // add other fields returned from login
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
