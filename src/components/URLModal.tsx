import { Dialog } from "radix-ui";
import Input from "./Input";
import Modal from "./Modal";
import useAppStore from "../store/useAppStore";
import { useState } from "react";
import { LuCopy, LuSave } from "react-icons/lu";
import { cn, copyToClipboard } from "../lib/utils";
import useActiveAccount from "../hooks/useActiveAccount";
import { Button } from "./Button";

export default function URLModal({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const account = useActiveAccount();
  const { url } = account;
  const updateAccount = useAppStore((state) => state.updateAccount);

  const setUrl = (url: string) => {
    updateAccount(account.id, { url });
  };
  const [tempUrl, setTempUrl] = useState(url || "");

  /* Handle Confirm */
  const handleConfirm = () => {
    try {
      new URL(tempUrl);
      setUrl(tempUrl);
    } catch {
      setUrl("");
    }
  };

  return (
    <Modal onOpenChange={onOpenChange}>
      <Dialog.Title className="text-lg font-medium">Set URL</Dialog.Title>
      <Dialog.Description className="text-sm text-neutral-400 mb-4">
        Please enter a valid URL:
      </Dialog.Description>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="(Optional) https://example.com"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
          />

          <button
            onClick={() => copyToClipboard(url || "")}
            className={cn(
              "px-3 py-2 rounded-lg transition-colors bg-neutral-800 hover:bg-neutral-700",
              "cursor-pointer text-neutral-400 hover:text-neutral-200",
              "shrink-0"
            )}
          >
            <LuCopy className="size-5" />
          </button>
        </div>

        <Dialog.Close onClick={handleConfirm} asChild>
          <Button>
            <LuSave className="size-5" />
            Confirm
          </Button>
        </Dialog.Close>
      </div>
    </Modal>
  );
}
