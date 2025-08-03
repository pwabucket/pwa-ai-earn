import { useQuery } from "@tanstack/react-query";

import { findBackupFile } from "../lib/googleDrive";

export default function useGoogleBackupFileQuery(enabled: boolean) {
  return useQuery({
    enabled,
    queryKey: ["google-drive", "backup-file", enabled],
    queryFn: () => findBackupFile(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 15_000,
  });
}
