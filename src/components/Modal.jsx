import { Dialog } from "radix-ui";

import { cn } from "../lib/utils";

export default function Modal({ onOpenChange, children }) {
  return (
    <Dialog.Root open={true} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40 overflow-y-auto grid place-items-center py-10">
          <Dialog.Content
            className={cn(
              "bg-neutral-900 text-white rounded-2xl p-6",
              "w-full max-w-md shadow-2xl border border-neutral-800"
            )}
          >
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
