import Modal from "./Modal";
import { useUser } from "../hooks/useUser";
import { Dialog } from "radix-ui";
import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";
import useActiveAccount from "../hooks/useActiveAccount";
import { HeaderButton } from "./HeaderButton";
import useAppStore from "../store/useAppStore";
import { AccountAvatar } from "./AccountAvatar";
import { cn } from "../lib/utils";

export default function WebviewModal({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const accounts = useAppStore((state) => state.accounts);
  const activeAccountId = useAppStore((state) => state.activeAccountId);
  const setActiveAccountId = useAppStore((state) => state.setActiveAccountId);
  const account = useActiveAccount();
  const url = account.url;
  const user = useUser();

  const navigateToNextAccount = (direction: 1 | -1) => {
    if (accounts.length <= 1) return;

    const currentIndex = accounts.findIndex(
      (acc) => acc.id === activeAccountId
    );
    let newIndex = currentIndex + direction;

    if (newIndex < 0) {
      newIndex = accounts.length - 1;
    } else if (newIndex >= accounts.length) {
      newIndex = 0;
    }

    const newAccount = accounts[newIndex];
    setActiveAccountId(newAccount.id);
  };

  return (
    <Modal
      onOpenChange={onOpenChange}
      overlayClassName="p-4"
      contentClassName="p-0 h-full max-h-[768px] overflow-hidden gap-0 flex flex-col"
    >
      <Dialog.Title className="sr-only">{account.title}</Dialog.Title>
      <Dialog.Description className="sr-only">
        Webview for {account.title}
      </Dialog.Description>

      <div className="p-4 flex gap-4 items-center">
        <div className="grow min-w-0 flex items-center gap-2">
          {user ? (
            <img
              src={user["photo_url"]}
              alt={user["first_name"]}
              className="size-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <AccountAvatar account={account} className="size-10" />
          )}
          <div className="flex flex-col pr-2 min-w-0">
            {user ? (
              <>
                <span className="font-bold text-pink-400 truncate">
                  {`${user["first_name"]} ${user["last_name"] || ""}`}
                </span>
                <span className="text-sm text-neutral-400 truncate">
                  @{user["username"] || "Telegram User"}
                </span>
              </>
            ) : (
              <span className="font-bold text-pink-400 truncate">
                {account.title}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Navigation buttons */}
          {accounts.length > 1 && (
            <>
              <HeaderButton
                onClick={() => navigateToNextAccount(-1)}
                title="Previous day"
              >
                <LuChevronLeft className="size-5" />
              </HeaderButton>
              <HeaderButton
                onClick={() => navigateToNextAccount(1)}
                title="Next day"
              >
                <LuChevronRight className="size-5" />
              </HeaderButton>
            </>
          )}

          {/* Close button */}
          <Dialog.Close asChild>
            <HeaderButton>
              <LuX className="size-5" />
            </HeaderButton>
          </Dialog.Close>
        </div>
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
