import type { StateCreator } from "zustand";

import type { GoogleApiToken, GoogleDriveBackupFile } from "../types/app";

export type GoogleDriveSlice = {
  googleDriveAuthToken: GoogleApiToken | null;
  googleDriveBackupFile: GoogleDriveBackupFile | null;
  setGoogleDriveAuthToken: (token: GoogleApiToken | null) => void;
  setGoogleDriveBackupFile: (file: GoogleDriveBackupFile | null) => void;
  clearGoogleDriveData: () => void;
};

export const createGoogleDriveSlice: StateCreator<GoogleDriveSlice> = (
  set
) => ({
  googleDriveAuthToken: null,
  googleDriveBackupFile: null,
  setGoogleDriveAuthToken: (token) => set({ googleDriveAuthToken: token }),
  setGoogleDriveBackupFile: (file) => set({ googleDriveBackupFile: file }),
  clearGoogleDriveData: () =>
    set({ googleDriveAuthToken: null, googleDriveBackupFile: null }),
});
