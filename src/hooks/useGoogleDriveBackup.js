/* eslint-disable no-undef */
import toast from "react-hot-toast";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDebounce } from "react-use";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import useAppStore from "../store/useAppStore";
import useGoogleBackupFileQuery from "./useGoogleBackupFileQuery";
import {
  fetchBackupContent,
  findBackupFile,
  uploadBackup,
} from "../lib/googleDrive";

/**
 * Google Drive Backup
 * @param {object} googleApi Google Api
 * @param {boolean} googleApi.authorized Is Authorized
 * @param {function} googleApi.requestAccessToken Request Access Token
 */
export default function useGoogleDriveBackup(googleApi) {
  const { authorized, requestAccessToken } = googleApi;
  const restoredFromCloudRef = useRef(true);

  const investments = useAppStore((state) => state.investments);
  const withdrawals = useAppStore((state) => state.withdrawals);
  const setInvestments = useAppStore((state) => state.setInvestments);
  const setWithdrawals = useAppStore((state) => state.setWithdrawals);
  const googleDriveBackupFile = useAppStore(
    (state) => state.googleDriveBackupFile
  );
  const setGoogleDriveAuthToken = useAppStore(
    (state) => state.setGoogleDriveAuthToken
  );
  const setGoogleDriveBackupFile = useAppStore(
    (state) => state.setGoogleDriveBackupFile
  );

  const queryClient = useQueryClient();
  const query = useGoogleBackupFileQuery(authorized);

  const hasFetchedRemoteBackupFile = query.isSuccess;
  const remoteBackupFile = query?.data;

  const { mutateAsync } = useMutation({
    mutationKey: ["google-drive", "upload-to-drive", authorized],
    mutationFn: (content) => uploadBackup(content),
  });

  /** Update Backup File Query */
  const updateBackupFileQuery = useCallback(
    (file) => {
      queryClient.setQueryData(["google-drive", "backup-file"], () => file);
    },
    [queryClient]
  );

  /** Update Backup File */
  const updateBackupFile = useCallback(
    (file) => {
      /** Update Query Data */
      updateBackupFileQuery(file);

      /** Set Backup File */
      setGoogleDriveBackupFile(file);
    },
    [updateBackupFileQuery, setGoogleDriveBackupFile]
  );

  /** Backup to Drive */
  const backupToDrive = useCallback(async () => {
    const content = {
      updatedAt: Date.now(),
      data: {
        investments,
        withdrawals,
      },
    };
    const file = await mutateAsync(content);

    /** Update Backup File */
    updateBackupFile(file);
  }, [
    /** Deps */
    investments,
    withdrawals,
    mutateAsync,
    updateBackupFile,
  ]);

  /** Import Drive Backup */
  const importDriveBackup = useCallback(
    async (content) => {
      const { data } = content;

      setInvestments(data.investments);
      setWithdrawals(data.withdrawals);

      restoredFromCloudRef.current = true;
    },
    [setInvestments, setWithdrawals]
  );

  /** Restore Backup */
  const restoreBackup = useCallback(
    async (remoteBackupFile) => {
      const content = await fetchBackupContent(remoteBackupFile.id);
      await importDriveBackup(content);
      await updateBackupFile(remoteBackupFile);
    },
    [importDriveBackup, updateBackupFile]
  );

  /** Authorize */
  const authorize = useCallback(
    async ({ prompt, forceRestore = false }) => {
      const toastId = "google-drive-authorize";
      const token = await toast.promise(
        requestAccessToken(),
        {
          loading: "Authorizing...",
          success: "Google Authorized",
          error: "Failed to Authorize",
        },
        { id: toastId }
      );

      try {
        /** Set Token */
        gapi.client.setToken(token);

        /** Find Backup File */
        const remoteBackupFile = await toast.promise(
          findBackupFile(),
          {
            loading: "Checking for Backup...",
            success: "Done!",
            error: "Failed to Detect Backup!",
          },
          { id: toastId }
        );

        if (remoteBackupFile) {
          const shouldRestore = await prompt(remoteBackupFile);

          if (shouldRestore) {
            await toast.promise(
              restoreBackup(remoteBackupFile),
              {
                loading: "Restoring Backup...",
                success: "Restored Backup!",
                error: "Failed to Restore Backup!",
              },
              { id: toastId }
            );
          } else if (forceRestore === false) {
            await toast.promise(
              backupToDrive(),
              {
                loading: "Uploading Backup...",
                success: "Uploaded Backup!",
                error: "Failed to Upload Backup!",
              },
              { id: toastId }
            );
          } else {
            return;
          }
        } else if (forceRestore) {
          return toast.error("No backup found!", { id: toastId });
        }

        /** Store Token */
        setGoogleDriveAuthToken(token);
      } catch {
        /** Unset Token */
        gapi.client.setToken(null);
      }
    },
    [
      /** Deps */
      backupToDrive,
      restoreBackup,
      setGoogleDriveAuthToken,
      requestAccessToken,
    ]
  );

  /** Restore From Drive */
  useEffect(() => {
    if (hasFetchedRemoteBackupFile) {
      if (remoteBackupFile) {
        if (
          new Date(remoteBackupFile.modifiedTime || null).getTime() >
          new Date(googleDriveBackupFile?.modifiedTime || null).getTime()
        ) {
          restoreBackup(remoteBackupFile);
        }
      } else {
        backupToDrive();
      }
    }
  }, [
    hasFetchedRemoteBackupFile,
    remoteBackupFile,
    googleDriveBackupFile,
    restoreBackup,
    backupToDrive,
  ]);

  /** Automatically Backup to Drive */
  useDebounce(
    () => {
      if (authorized === false) {
        restoredFromCloudRef.current = true;
      } else if (restoredFromCloudRef.current === true) {
        restoredFromCloudRef.current = false;
      } else {
        backupToDrive();
      }
    },
    500,
    [authorized, backupToDrive]
  );

  return useMemo(
    () => ({
      authorize,
      backupToDrive,
      restoreBackup,
      importDriveBackup,
    }),
    [
      /** Deps */
      authorize,
      backupToDrive,
      restoreBackup,
      importDriveBackup,
    ]
  );
}
