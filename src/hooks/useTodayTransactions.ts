import { useMemo } from "react";

import type { Transaction } from "../types/app";
import InvestmentEngine from "../lib/InvestmentEngine";

export const useTodayTransactions = (
  selectedDate: Date,
  transactions: Transaction[],
  todaysProfit: number
) => {
  return useMemo((): Transaction[] => {
    const todayTransactions = transactions.filter(
      (transaction) =>
        new Date(transaction.date).toDateString() ===
        selectedDate.toDateString()
    );

    const { investments, withdrawals, exchanges } =
      InvestmentEngine.filterTransactions(todayTransactions);

    return [
      {
        id: "todays-earnings",
        type: "earnings",
        amount: todaysProfit,
        date: selectedDate,
      },
      ...withdrawals,
      ...exchanges,
      ...investments,
    ];
  }, [selectedDate, transactions, todaysProfit]);
};
