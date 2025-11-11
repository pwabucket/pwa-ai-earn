import { useQuery } from "@tanstack/react-query";

import useAppContext from "./useAppContext";

export default function useTransactionsQuery() {
  const { enabled, tracker } = useAppContext().tracker!;

  return useQuery({
    enabled,
    queryKey: ["transactions"],
    queryFn: () => tracker!.getTransactions(),
  });
}
