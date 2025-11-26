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
    <Modal onOpenChange={onOpenChange} fullHeight={true} overlayClassName="p-4">
      {/* Header */}
      <AccountModalHeader />

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
