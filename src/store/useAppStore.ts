import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  createGoogleDriveSlice,
  type GoogleDriveSlice,
} from "./googleDriveSlice";
import { createAppSlice, type AppSlice } from "./appSlice";

const useAppStore = create(
  persist<AppSlice & GoogleDriveSlice>(
    (...a) => ({
      ...createAppSlice(...a),
      ...createGoogleDriveSlice(...a),
    }),
    {
      name: "app-storage",
    }
  )
);

export default useAppStore;
