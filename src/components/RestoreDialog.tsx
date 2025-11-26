import { Dialog } from "radix-ui";
import { HeaderButton } from "./HeaderButton";
import Modal from "./Modal";
import { LuX, LuUpload, LuFileJson } from "react-icons/lu";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import type { BackupData } from "../types/app";
import toast from "react-hot-toast";
import useAppStore from "../store/useAppStore";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router";

export default function RestoreDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const setAccounts = useAppStore((state) => state.setAccounts);
  const setActiveAccountId = useAppStore((state) => state.setActiveAccountId);

  /* Handle file drop */
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.addEventListener("load", (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as BackupData;
          if (!data?.data?.accounts) {
            throw new Error("Invalid Backup Data");
          }

          const accounts = data.data.accounts;

          setAccounts(accounts);
          if (accounts.length > 0) {
            setActiveAccountId(accounts[0].id);
          }
          navigate("/", { replace: true });
          toast.success("Data restored successfully!");
        } catch {
          toast.error("Invalid Backup file!");
        }
      });
      reader.readAsText(file);
    },
    [setAccounts, setActiveAccountId, navigate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <Modal onOpenChange={onClose} contentClassName="gap-4">
      {/* Dialog Header */}
      <div className="flex gap-2 items-center shrink-0">
        <div className="grow min-w-0">
          <Dialog.Title className="text-lg font-bold">
            Restore Data
          </Dialog.Title>
          <Dialog.Description className="text-sm text-neutral-400">
            Restore your data from a previous backup.
          </Dialog.Description>
        </div>

        <Dialog.Close asChild>
          <HeaderButton>
            <LuX className="size-5" />
          </HeaderButton>
        </Dialog.Close>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl cursor-pointer transition-all",
          "px-6 py-12 text-center",
          "flex flex-col items-center justify-center gap-4",
          isDragActive
            ? "border-pink-400 bg-pink-500/10 scale-[1.02]"
            : "border-neutral-700 hover:border-pink-500/50 hover:bg-neutral-800/50"
        )}
      >
        <input {...getInputProps()} />

        <div
          className={cn(
            "rounded-full p-4 transition-colors",
            isDragActive
              ? "bg-pink-500/20 text-pink-400"
              : "bg-neutral-800 text-neutral-400"
          )}
        >
          {isDragActive ? (
            <LuFileJson className="size-8" />
          ) : (
            <LuUpload className="size-8" />
          )}
        </div>

        <div className="space-y-1">
          <p
            className={cn(
              "font-medium transition-colors",
              isDragActive ? "text-pink-400" : "text-neutral-200"
            )}
          >
            {isDragActive ? "Drop your backup file here" : "Upload Backup File"}
          </p>
          <p className="text-sm text-neutral-400">
            {isDragActive
              ? "Release to restore your data"
              : "Drag & drop or click to select a JSON backup file"}
          </p>
        </div>

        <div className="text-xs text-neutral-500">Accepted format: .json</div>
      </div>
    </Modal>
  );
}
