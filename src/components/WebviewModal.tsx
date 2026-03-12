import AccountModalHeader from "./AccountModalHeader";
import Modal from "./Modal";
import { cn } from "../lib/utils";
import useActiveAccount from "../hooks/useActiveAccount";
import { useLocationIndexUpdater } from "@pwabucket/pwa-router";

const WebviewModalContent = () => {
  const account = useActiveAccount();
  const url = account.url;

  /* Ensure that the webview modal is closed when navigating away */
  useLocationIndexUpdater("webview");

  return (
    <>
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
            "bg-neutral-800/50 text-neutral-400",
          )}
        >
          No URL set for this account.
        </div>
      )}
    </>
  );
};

export default function WebviewModal({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Modal onOpenChange={onOpenChange} fullHeight={true} overlayClassName="p-4">
      <WebviewModalContent />
    </Modal>
  );
}
