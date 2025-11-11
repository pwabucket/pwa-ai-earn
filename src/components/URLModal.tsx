import { Dialog } from "radix-ui";
import Input from "./Input";
import Modal from "./Modal";
import useAppStore from "../store/useAppStore";
import { useState } from "react";

export default function URLModal({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const url = useAppStore((state) => state.url);
  const setUrl = useAppStore((state) => state.setUrl);
  const [tempUrl, setTempUrl] = useState(url);

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
        <Input
          placeholder="https://example.com"
          value={tempUrl}
          onChange={(e) => setTempUrl(e.target.value)}
        />

        <Dialog.Close
          onClick={handleConfirm}
          className="bg-pink-500 text-white px-4 py-2 rounded-xl cursor-pointer"
        >
          Confirm
        </Dialog.Close>
      </div>
    </Modal>
  );
}
