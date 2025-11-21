import useActiveAccount from "../hooks/useActiveAccount";
import { useUser } from "../hooks/useUser";
import PageContainer from "./PageContainer";
import { LuChevronsUpDown } from "react-icons/lu";
import { AccountAvatar } from "./AccountAvatar";
import AccountsDialog from "./AccountsDialog";
import useLocationToggle from "../hooks/useLocationToggle";

export default function Footer() {
  const activeAccount = useActiveAccount();
  const user = useUser();

  const [showAccountsDialog, toggleAccountsDialog] =
    useLocationToggle("accounts-dialog");

  return (
    <div className="h-16">
      <div className="bg-neutral-900 border-t border-neutral-800 fixed bottom-0 inset-x-0 h-16 flex items-center z-10">
        <PageContainer className="flex justify-center">
          <button
            className="flex gap-2 items-center text-left cursor-pointer"
            onClick={() => toggleAccountsDialog(true)}
          >
            <div className="size-10 shrink-0">
              {user ? (
                <img
                  src={user["photo_url"]}
                  alt={user["first_name"]}
                  className="size-full rounded-full object-cover shrink-0"
                />
              ) : (
                <AccountAvatar account={activeAccount} className="size-full" />
              )}
            </div>
            <div className="flex flex-col text-sm grow min-w-0">
              <h1 className="font-bold text-pink-500 truncate">
                {activeAccount.title}
              </h1>
              {user ? (
                <>
                  <p className="text-neutral-400 truncate">
                    {user["first_name"]} {user["last_name"]}
                  </p>
                </>
              ) : null}
            </div>

            <LuChevronsUpDown className="size-5 text-neutral-400 shrink-0" />
          </button>

          {showAccountsDialog && (
            <AccountsDialog onClose={() => toggleAccountsDialog(false)} />
          )}
        </PageContainer>
      </div>
    </div>
  );
}
