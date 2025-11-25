import { LuChevronsUpDown } from "react-icons/lu";
import useActiveAccount from "../hooks/useActiveAccount";
import { useUser } from "../hooks/useUser";
import { cn } from "../lib/utils";
import { AccountAvatar } from "./AccountAvatar";

export default function AccountSwitcherButton(
  props: React.ComponentProps<"button">
) {
  const activeAccount = useActiveAccount();
  const user = useUser();
  return (
    <button
      {...props}
      className={cn(
        "flex gap-2 items-center justify-center text-left",
        "cursor-pointer w-full max-w-56",
        props.className
      )}
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
      <div className="flex flex-col text-sm grow min-w-0 gap-1">
        <h1 className="font-bold text-pink-500 truncate leading-none">
          {activeAccount.title}
        </h1>
        {user ? (
          <>
            <p className="text-neutral-400 truncate leading-none">
              {user["first_name"]} {user["last_name"]}
            </p>
          </>
        ) : null}
      </div>

      <LuChevronsUpDown className="size-5 text-neutral-400 shrink-0" />
    </button>
  );
}
