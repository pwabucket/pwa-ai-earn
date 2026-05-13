import { useQuery } from "@tanstack/react-query";

import type { Account } from "../types/app";
import { useTrackerProvider } from "./useTrackerProvider";

export default function useTransactionsQuery(account: Account) {
  const { createProvider } = useTrackerProvider();

  return useQuery({
    enabled: Boolean(account.url),
    queryKey: ["transactions", account.id, account.provider],
    queryFn: () =>
      createProvider(account.provider, account.url!).getTransactions(),
    refetchInterval: 60_000,
  });
}
