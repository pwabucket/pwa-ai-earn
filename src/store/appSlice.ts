import type { StateCreator } from "zustand/vanilla";

export interface AppSlice {
  url: string;
  setUrl: (url: string) => void;
}

export const createAppSlice: StateCreator<AppSlice> = (set) => ({
  url: "",
  setUrl: (url) => set({ url }),
});
