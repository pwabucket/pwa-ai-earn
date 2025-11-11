import { useEffect } from "react";
import useAppStore from "../store/useAppStore";
import useTransactionsQuery from "./useTransactionsQuery";

export const useDataUpdate = () => {
  const setInvestments = useAppStore((state) => state.setInvestments);
  const setWithdrawals = useAppStore((state) => state.setWithdrawals);
  const transactionsQuery = useTransactionsQuery();
  const data = transactionsQuery.data;

  useEffect(() => {
    if (data) {
      console.log("Transactions data:", data);

      const updatedInvestments = [];
      const updatedWithdrawals = [];
      for (const item of data) {
        switch (item.type) {
          case "Purchased TP": {
            updatedInvestments.push({
              id: item.id.toString(),
              date: new Date(item["create_time"]),
              amount: Number(item["tp"]),
            });
            break;
          }

          case "Withdrawals": {
            updatedWithdrawals.push({
              id: item.id.toString(),
              date: new Date(item["create_time"]),
              amount: Number(item["tp"]),
            });
            break;
          }

          case "Exchange": {
            const details = {
              id: item.id.toString(),
              date: new Date(item["create_time"]),
              amount: Number(item["tp"]),
            };
            updatedInvestments.push(details);
            updatedWithdrawals.push(details);
            break;
          }
        }
      }

      setInvestments(updatedInvestments);
      setWithdrawals(updatedWithdrawals);
    }
  }, [data, setInvestments, setWithdrawals]);
};
