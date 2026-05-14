import { useMemo } from "react";

import type { Transaction } from "../types/app";
import { useInvestmentEngine } from "./useInvestmentEngine";

export const useInvestmentCalculations = (
  selectedDate: Date,
  transactions: Transaction[]
) => {
  const engine = useInvestmentEngine();

  return useMemo(() => {
    return engine.calculateInvestments(selectedDate, transactions);
  }, [engine, selectedDate, transactions]);
};
