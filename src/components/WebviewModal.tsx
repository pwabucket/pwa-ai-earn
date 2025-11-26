import Modal from "./Modal";
import useActiveAccount from "../hooks/useActiveAccount";
import { cn } from "../lib/utils";
import AccountModalHeader from "./AccountModalHeader";

export default function WebviewModal({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const account = useActiveAccount();
  const url = account.url;

  return (
    <Modal
      onOpenChange={onOpenChange}
      overlayClassName="p-4"
      contentClassName="p-0 h-full max-h-[768px] overflow-hidden gap-0 flex flex-col"
    >
      <div className="p-4 shrink-0">
        <AccountModalHeader />
      </div>

      {/* Iframe */}
      {url ? (
        <iframe
          key={account.id}
          src={url}
          className="grow border-0 bg-neutral-800/50"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={cn(
            "grow flex items-center justify-center",
            "bg-neutral-800/50 text-neutral-400"
          )}
        >
          No URL set for this account.
        </div>
      )}
    </Modal>
  );
}
