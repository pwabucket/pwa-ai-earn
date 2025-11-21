import { useQuery } from "@tanstack/react-query";

import type { Account } from "../types/app";
import { Tracker } from "../lib/Tracker";

export default function useTransactionsQuery(account: Account) {
  return useQuery({
    enabled: Boolean(account.url),
    queryKey: ["transactions", account.id],
    queryFn: () => new Tracker(account.url!).getTransactions(),
    refetchInterval: 60_000,
  });
}
