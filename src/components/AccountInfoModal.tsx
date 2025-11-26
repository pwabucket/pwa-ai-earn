import useActiveAccount from "../hooks/useActiveAccount";
import { AccountInfo } from "./AccountInfo";
import AccountModalHeader from "./AccountModalHeader";
import Modal from "./Modal";

export default function AccountInfoModal({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const account = useActiveAccount();
  return (
    <Modal onOpenChange={onOpenChange} fullHeight={true}>
      {/* Header */}
      <AccountModalHeader />

      {/* Account Info */}
      <div className="grow min-w-0 min-h-0 overflow-auto">
        {account.url ? (
          <AccountInfo account={account} />
        ) : (
          <div
            className={
              "flex items-center justify-center text-neutral-400 text-sm"
            }
          >
            No URL set for this account.
          </div>
        )}
      </div>
    </Modal>
  );
}
