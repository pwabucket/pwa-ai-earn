import useAppStore from "../store/useAppStore";
import type { BackupData } from "../types/app";
import { downloadJsonFile } from "./utils";

export function getBackupData() {
  const { accounts } = useAppStore.getState();

  const backupData: BackupData = {
    version: import.meta.env.PACKAGE_VERSION || "unknown",
    timestamp: new Date().toISOString(),
    data: {
      accounts,
    },
  };
  return backupData;
}

export async function createAndDownloadBackup() {
  const backupData = getBackupData();

  return downloadJsonFile("backup-data", backupData);
}
