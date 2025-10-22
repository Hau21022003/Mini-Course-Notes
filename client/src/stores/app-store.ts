import { authStorage } from "@/storage/features/auth.storage";
import { type Account } from "@/types/account.type";
import { create } from "zustand";

type AppStore = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  user: Account | null;
  setUser: (user: Account | null) => void;
  isAuthenticated: () => boolean;
};

export const useAppStore = create<AppStore>()((set, get) => ({
  isLoading: true,
  user: null,
  setUser: (user: Account | null) => {
    set({ user: user });
    if (user) authStorage.saveUser(user);
  },
  isAuthenticated: () => get().user !== null,
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading: isLoading });
  },
}));
