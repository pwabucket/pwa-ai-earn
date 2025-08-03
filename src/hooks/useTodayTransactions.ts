import { useMemo } from "react";

import type { Investment, Withdrawal } from "../types/app";

export const useTodayTransactions = (
  selectedDate: Date,
  investments: Investment[],
  withdrawals: Withdrawal[],
  todaysProfit: number
) => {
  return useMemo(() => {
    return [
      {
        type: "earnings",
        amount: todaysProfit,
        date: selectedDate,
      },
      ...withdrawals
        .filter(
          (withdrawal) =>
            new Date(withdrawal.date).toDateString() ===
            selectedDate.toDateString()
        )
        .map((withdrawal) => ({ ...withdrawal, type: "withdrawal" })),
      ...investments
        .filter(
          (investment) =>
            new Date(investment.date).toDateString() ===
            selectedDate.toDateString()
        )
        .map((investment) => ({
          ...investment,
          type: "investment",
        })),
    ];
  }, [selectedDate, investments, withdrawals, todaysProfit]);
};
