import { Dialog } from "radix-ui";
import Modal from "./Modal";
import { cn, extractTgWebAppData } from "../lib/utils";
import useAppStore from "../store/useAppStore";
import type { Account } from "../types/app";
import { useMemo, useState } from "react";
import { AccountAvatar } from "./AccountAvatar";
import { LuArrowLeft, LuUserPlus } from "react-icons/lu";
import { HeaderButton } from "./HeaderButton";
import { Reorder, useDragControls } from "motion/react";
import { MdEditNote } from "react-icons/md";
import AccountEditForm from "./AccountEditForm";
import { Button } from "./Button";

const AccountItem = ({
  account,
  active,
  onEdit,
}: {
  account: Account;
  active: boolean;
  onEdit: () => void;
}) => {
  const dragControls = useDragControls();
  const url = account.url;
  const user = useMemo(() => {
    try {
      return url ? extractTgWebAppData(url).initDataUnsafe.user : null;
    } catch {
      return null;
    }
  }, [url]);

  const setActiveAccountId = useAppStore((state) => state.setActiveAccountId);

  return (
    <Reorder.Item
      value={account}
      dragListener={false}
      dragControls={dragControls}
    >
      <div
        className={cn(
          "flex gap-2",
          "px-3 py-2 rounded-xl bg-neutral-800 transition-colors",
          active ? "bg-pink-500/20" : "hover:bg-neutral-700"
        )}
      >
        <div
          className="size-10 shrink-0"
          onPointerDown={(event) => dragControls.start(event)}
        >
          {user ? (
            <img
              src={user["photo_url"]}
              alt={user["first_name"]}
              className="size-full rounded-full object-cover shrink-0"
            />
          ) : (
            <AccountAvatar account={account} className="size-full" />
          )}
        </div>

        {/* Switcher */}
        <Dialog.Close
          className={cn(
            "text-left cursor-pointer",
            "flex flex-col text-sm grow min-w-0",
            "justify-center"
          )}
          onClick={() => setActiveAccountId(account.id)}
        >
          <h1 className="font-bold text-pink-500">{account.title}</h1>
          {user ? (
            <>
              <p className="text-neutral-400 truncate">
                {user["first_name"]} {user["last_name"]}
              </p>
            </>
          ) : null}
        </Dialog.Close>

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className={cn(
            "shrink-0 text-neutral-400 hover:text-white",
            "transition-colors cursor-pointer p-2"
          )}
        >
          <MdEditNote className="size-5" />
        </button>
      </div>
    </Reorder.Item>
  );
};

export default function AccountsDialog({ onClose }: { onClose: () => void }) {
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);

  const activeAccountId = useAppStore((state) => state.activeAccountId);
  const setActiveAccountId = useAppStore((state) => state.setActiveAccountId);

  const accounts = useAppStore((state) => state.accounts);
  const addAccount = useAppStore((state) => state.addAccount);
  const setAccounts = useAppStore((state) => state.setAccounts);
  const updateAccount = useAppStore((state) => state.updateAccount);
  const removeAccount = useAppStore((state) => state.removeAccount);

  /* Handle Add Account */
  const handleAddAccount = () => {
    const newAccount: Account = {
      id: crypto.randomUUID(),
      title: `Account ${accounts.length + 1}`,
      transactions: [],
    };
    addAccount(newAccount);
    setActiveAccountId(newAccount.id);
    onClose();
  };

  /* Handle Edit Submit */
  const handleEditSubmit = (data: Partial<Account>) => {
    if (accountToEdit) {
      updateAccount(accountToEdit.id, data);
      setAccountToEdit(null);
    }
  };

  /* Handle Delete Account */
  const handleDeleteAccount = () => {
    if (accountToEdit) {
      removeAccount(accountToEdit.id);
      setAccountToEdit(null);

      if (accountToEdit.id === activeAccountId) {
        const remainingAccounts = accounts.filter(
          (acc) => acc.id !== accountToEdit.id
        );
        if (remainingAccounts.length > 0) {
          setActiveAccountId(remainingAccounts[0].id);
        }
      }
    }
  };

  return (
    <Modal onOpenChange={onClose}>
      <div className="flex gap-4 items-start">
        {accountToEdit && (
          <HeaderButton
            className="text-neutral-400 hover:text-white transition-colors"
            onClick={() => setAccountToEdit(null)}
          >
            <LuArrowLeft className="size-6" />
          </HeaderButton>
        )}

        <div className="flex flex-col grow min-w-0">
          <Dialog.Title className="text-lg font-medium">
            {accountToEdit ? "Edit Account" : "Accounts"}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-neutral-400 mb-4">
            {accountToEdit
              ? `Editing "${accountToEdit.title}"`
              : "Manage your accounts. Drag to reorder."}
          </Dialog.Description>
        </div>

        {!accountToEdit && (
          <HeaderButton
            className="text-neutral-400 hover:text-white transition-colors"
            onClick={handleAddAccount}
          >
            <LuUserPlus className="size-6" />
          </HeaderButton>
        )}
      </div>

      {accountToEdit ? (
        <AccountEditForm
          account={accountToEdit}
          canDelete={accounts.length > 1}
          onSubmit={handleEditSubmit}
          onDelete={handleDeleteAccount}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <Reorder.Group
            values={accounts}
            onReorder={(newOrder) => setAccounts(newOrder)}
            className="flex flex-col gap-2"
          >
            {accounts.map((account) => (
              <AccountItem
                key={account.id}
                account={account}
                active={account.id === activeAccountId}
                onEdit={() => setAccountToEdit(account)}
              />
            ))}
          </Reorder.Group>

          <Dialog.Close asChild>
            <Button>Close</Button>
          </Dialog.Close>
        </div>
      )}
    </Modal>
  );
}
