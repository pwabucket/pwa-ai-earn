import useAppStore from "../store/useAppStore";

export default function useActiveAccount() {
  const activeAccountId = useAppStore((state) => state.activeAccountId);
  const accounts = useAppStore((state) => state.accounts);

  const activeAccount = accounts.find(
    (account) => account.id === activeAccountId
  );

  return activeAccount!;
}
