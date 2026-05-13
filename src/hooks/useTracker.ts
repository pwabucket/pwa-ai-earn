import { useEffect, useMemo, useRef } from "react";
import useAppStore from "../store/useAppStore";
import useActiveAccount from "./useActiveAccount";
import useTransactionsQuery from "./useTransactionsQuery";

export const useTracker = () => {
  const setTransactions = useAppStore((state) => state.setTransactions);
  const account = useActiveAccount();
  const pinnedTransactions = useMemo(
    () => account.transactions.filter((transaction) => transaction.pinned),
    [account.transactions]
  );

  /* Ref to keep track of pinned transactions */
  const pinnedTransactionsRef = useRef(pinnedTransactions);
  pinnedTransactionsRef.current = pinnedTransactions;

  const transactionsQuery = useTransactionsQuery(account);
  const data = transactionsQuery.data;

  const refresh = transactionsQuery.refetch;

  /*  Effect to update transactions when data changes */
  useEffect(() => {
    if (!account.enableLiveUpdates) return;
    if (!data) return;

    console.log("Transactions data:", data);

    const merged = [...pinnedTransactionsRef.current, ...data].filter(
      (item, index, list) => list.findIndex((t) => t.id === item.id) === index
    );

    setTransactions(account.id, merged);
  }, [account.id, account.enableLiveUpdates, data, setTransactions]);

  return { refresh };
};
