import type { Account } from "../types/app";
import { useQuery } from "@tanstack/react-query";
import { useTrackerProvider } from "./useTrackerProvider";

export default function useTransactionsQuery(account: Account) {
  const { createProvider } = useTrackerProvider();

  return useQuery({
    enabled: Boolean(account.url),
    queryKey: ["transactions", account.id, account.provider],
    queryFn: async () => {
      const tracker = createProvider(account.provider, account.url!);
      await tracker.initialize();
      return tracker.getTransactions();
    },
    refetchInterval: 60_000,
  });
}
