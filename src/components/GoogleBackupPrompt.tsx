import { Dialog } from "radix-ui";
import { FaGoogleDrive } from "react-icons/fa";
import { formatDate } from "date-fns";

import type { GoogleDriveBackupFile } from "../types/app";
import { cn } from "../lib/utils";
import Modal from "./Modal";

export default function GoogleBackupPrompt({
  open,
  onOpenChange,
  resolve,
  backupFile,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resolve: (value: boolean) => void;
  backupFile: GoogleDriveBackupFile;
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} contentClassName="gap-2">
      {/* Title */}
      <Dialog.Title
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          "font-bold text-center",
          "text-pink-500"
        )}
      >
        <img src={"/icon.png"} className="size-20 rounded-full" />
        {import.meta.env.VITE_APP_NAME}
      </Dialog.Title>

      {/* Description */}
      <Dialog.Description
        className={cn(
          "px-2 text-center text-neutral-400",
          "flex items-center justify-center gap-2"
        )}
      >
        <FaGoogleDrive /> Google Drive Backup
      </Dialog.Description>

      <p className="text-sm text-center font-bold text-pink-500 px-2">
        {formatDate(
          new Date(backupFile?.modifiedTime || Date.now()),
          "PPPPpppp"
        )}
      </p>

      {/* Restore Button */}
      <Dialog.Close
        onClick={() => resolve(true)}
        className={cn(
          "px-4 py-2 bg-pink-500 text-white",
          "rounded-xl font-bold text-sm cursor-pointer"
        )}
      >
        Restore
      </Dialog.Close>

      {/* Cancel Button */}
      <Dialog.Close
        onClick={() => resolve(false)}
        className={cn(
          "px-4 py-2 bg-neutral-800 rounded-xl",
          "font-bold text-sm cursor-pointer"
        )}
      >
        Cancel
      </Dialog.Close>
    </Modal>
  );
}
