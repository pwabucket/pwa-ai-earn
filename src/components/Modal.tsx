import { Dialog } from "radix-ui";

import { cn } from "../lib/utils";

export interface ModalProps extends Dialog.DialogProps {
  overlayRef?: React.RefObject<HTMLDivElement>;
  contentRef?: React.RefObject<HTMLDivElement>;
  overlayClassName?: string;
  contentClassName?: string;
  preventCloseOnOutsideClick?: boolean;
  fullHeight?: boolean;
}

export default function Modal({
  open = true,
  preventCloseOnOutsideClick = true,
  onOpenChange,
  children,
  overlayClassName,
  contentClassName,
  overlayRef,
  contentRef,
  fullHeight,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          ref={overlayRef}
          className={cn(
            "fixed inset-0 bg-black/60 z-40 overflow-y-auto flex items-center justify-center py-10",
            overlayClassName
          )}
        >
          <Dialog.Content
            ref={contentRef}
            onInteractOutside={(ev) =>
              preventCloseOnOutsideClick && ev.preventDefault()
            }
            onOpenAutoFocus={(ev) => ev.preventDefault()}
            className={cn(
              "bg-neutral-900 text-white rounded-2xl overflow-hidden",
              "w-full max-w-md shadow-2xl border border-neutral-800 my-auto",
              "flex flex-col",
              fullHeight ? "h-full max-h-[768px]" : "p-6",
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
