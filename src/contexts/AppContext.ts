import { createContext } from "react";

import type useGoogleApi from "../hooks/useGoogleApi";
import type useGoogleDriveBackup from "../hooks/useGoogleDriveBackup";

export interface AppContextValue {
  googleApi: ReturnType<typeof useGoogleApi> | null;
  googleDriveBackup: ReturnType<typeof useGoogleDriveBackup> | null;
}

export default createContext<AppContextValue>({
  googleApi: null,
  googleDriveBackup: null,
});
