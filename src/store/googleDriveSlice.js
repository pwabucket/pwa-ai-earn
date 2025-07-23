export const createGoogleDriveSlice = (set) => ({
  googleDriveAuthToken: null,
  googleDriveBackupFile: null,
  setGoogleDriveAuthToken: (token) => set({ googleDriveAuthToken: token }),
  setGoogleDriveBackupFile: (file) => set({ googleDriveBackupFile: file }),
  clearGoogleDriveData: () =>
    set({ googleDriveAuthToken: null, googleDriveBackupFile: null }),
});
