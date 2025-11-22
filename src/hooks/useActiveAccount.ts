import { useMemo } from "react";
import useAppStore from "../store/useAppStore";

export default function useActiveAccount() {
  const activeAccountId = useAppStore((state) => state.activeAccountId);
  const accounts = useAppStore((state) => state.accounts);

  return useMemo(
    () => accounts.find((account) => account.id === activeAccountId),
    [accounts, activeAccountId]
  )!;
}
