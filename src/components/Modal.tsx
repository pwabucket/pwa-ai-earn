import { Dialog } from "radix-ui";

import { cn } from "../lib/utils";

export interface ModalProps extends Dialog.DialogProps {
  overlayRef?: React.RefObject<HTMLDivElement>;
  contentRef?: React.RefObject<HTMLDivElement>;
  overlayClassName?: string;
  contentClassName?: string;
}

export default function Modal({
  open = true,
  onOpenChange,
  children,
  overlayClassName,
  contentClassName,
  overlayRef,
  contentRef,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          ref={overlayRef}
          className={cn(
            "fixed inset-0 bg-black/60 z-40 overflow-y-auto grid place-items-center py-10",
            overlayClassName
          )}
        >
          <Dialog.Content
            ref={contentRef}
            onInteractOutside={(ev) => ev.preventDefault()}
            onOpenAutoFocus={(ev) => ev.preventDefault()}
            className={cn(
              "bg-neutral-900 text-white rounded-2xl p-6",
              "w-full max-w-md shadow-2xl border border-neutral-800",
              contentClassName
            )}
          >
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
