import { useEffect, useMemo, useRef } from "react";
import useAppStore from "../store/useAppStore";
import useActiveAccount from "./useActiveAccount";
import type { Transaction } from "../types/app";
import useTransactionsQuery from "./useTransactionsQuery";
import Decimal from "decimal.js";

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
    if (data) {
      console.log("Transactions data:", data);

      /*  Start with pinned transactions to retain their state */
      const updatedTransactions: Transaction[] = [
        ...pinnedTransactionsRef.current,
      ];

      const pushTransaction = (
        type: Transaction["type"],
        item: (typeof data)[number]
      ) => {
        updatedTransactions.push({
          id: item.id.toString(),
          date: new Date(item["create_time"]),
          amount: new Decimal(item["tp"]),
          type,
        });
      };

      for (const item of data) {
        switch (item.type) {
          case "Purchased TP": {
            pushTransaction("investment", item);
            break;
          }

          case "Withdrawals": {
            pushTransaction("withdrawal", item);
            break;
          }

          case "Exchange": {
            pushTransaction("exchange", item);
            break;
          }
        }
      }

      /*  Update the transactions in the store */
      setTransactions(
        account.id,
        updatedTransactions.filter(
          (item, index, list) =>
            list.findIndex((t) => t.id === item.id) === index
        )
      );
    }
  }, [account.id, account.enableLiveUpdates, data, setTransactions]);

  return { refresh };
};
