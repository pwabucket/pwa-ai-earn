import { useEffect, useMemo } from "react";
import useAppStore from "../store/useAppStore";
import { Tracker } from "../lib/Tracker";
import { useQuery } from "@tanstack/react-query";

export const useTracker = () => {
  const url = useAppStore((state) => state.url);
  const enabled = Boolean(url);
  const tracker = useMemo(() => {
    return url ? new Tracker(url) : null;
  }, [url]);

  const transactionsQuery = useQuery({
    enabled,
    queryKey: ["transactions"],
    queryFn: () => tracker!.getTransactions(),
    refetchInterval: 60_000,
  });

  const data = transactionsQuery.data;
  const setInvestments = useAppStore((state) => state.setInvestments);
  const setWithdrawals = useAppStore((state) => state.setWithdrawals);

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

  return { tracker, enabled, url };
};
