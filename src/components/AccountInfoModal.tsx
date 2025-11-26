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
    <Modal
      onOpenChange={onOpenChange}
      contentClassName="p-0 h-full max-h-[768px] overflow-hidden gap-0 flex flex-col"
    >
      <div className="p-4 shrink-0">
        <AccountModalHeader />
      </div>
      <div className="grow min-w-0 min-h-0 overflow-auto">
        {account.url ? (
          <AccountInfo account={account} />
        ) : (
          <div
            className={"grow flex items-center justify-center text-neutral-400"}
          >
            No URL set for this account.
          </div>
        )}
      </div>
    </Modal>
  );
}
