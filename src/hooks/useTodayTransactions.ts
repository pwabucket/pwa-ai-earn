import type { Decimal } from "decimal.js";
import type { Transaction } from "../types/app";
import { useMemo } from "react";
import { useInvestmentEngine } from "./useInvestmentEngine";

export const useTodayTransactions = (
  selectedDate: Date,
  transactions: Transaction[],
  todaysProfit: Decimal.Value,
) => {
  const engine = useInvestmentEngine();

  return useMemo((): Transaction[] => {
    const todayTransactions = transactions.filter(
      (transaction) =>
        new Date(transaction.date).toDateString() ===
        selectedDate.toDateString(),
    );

    const { investments, withdrawals, exchanges, earnings } =
      engine.filterTransactions(todayTransactions);

    return [
      {
        id: "todays-profit",
        type: "profit",
        title: "Daily Profit",
        amount: todaysProfit,
        date: selectedDate,
      },
      ...earnings,
      ...withdrawals,
      ...exchanges,
      ...investments,
    ];
  }, [engine, selectedDate, transactions, todaysProfit]);
};
