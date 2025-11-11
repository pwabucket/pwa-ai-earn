import { createContext } from "react";

import type useGoogleApi from "../hooks/useGoogleApi";
import type useGoogleDriveBackup from "../hooks/useGoogleDriveBackup";
import type { useTracker } from "../hooks/useTracker";

export interface AppContextValue {
  googleApi: ReturnType<typeof useGoogleApi> | null;
  googleDriveBackup: ReturnType<typeof useGoogleDriveBackup> | null;
  tracker: ReturnType<typeof useTracker> | null;
}

export default createContext<AppContextValue>({
  googleApi: null,
  googleDriveBackup: null,
  tracker: null,
});
