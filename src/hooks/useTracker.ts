import { useEffect } from "react";
import useAppStore from "../store/useAppStore";
import useActiveAccount from "./useActiveAccount";
import type { Transaction } from "../types/app";
import useTransactionsQuery from "./useTransactionsQuery";

export const useTracker = () => {
  const setTransactions = useAppStore((state) => state.setTransactions);
  const account = useActiveAccount();

  const transactionsQuery = useTransactionsQuery(account);
  const data = transactionsQuery.data;

  const refresh = transactionsQuery.refetch;

  useEffect(() => {
    if (data) {
      console.log("Transactions data:", data);

      const updatedTransactions: Transaction[] = [];

      for (const item of data) {
        switch (item.type) {
          case "Purchased TP": {
            updatedTransactions.push({
              id: item.id.toString(),
              date: new Date(item["create_time"]),
              amount: Number(item["tp"]),
              type: "investment",
            });
            break;
          }

          case "Withdrawals": {
            updatedTransactions.push({
              id: item.id.toString(),
              date: new Date(item["create_time"]),
              amount: Number(item["tp"]),
              type: "withdrawal",
            });
            break;
          }

          case "Exchange": {
            updatedTransactions.push({
              id: item.id.toString(),
              date: new Date(item["create_time"]),
              amount: Number(item["tp"]),
              type: "exchange",
            });
            break;
          }
        }
      }

      /*  Update the transactions in the store */
      setTransactions(account.id, updatedTransactions);
    }
  }, [data, setTransactions, account.id]);

  return { refresh };
};
