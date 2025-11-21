import { useMemo } from "react";

import InvestmentEngine from "../lib/InvestmentEngine";
import type { Transaction } from "../types/app";

// =============================================================================
// CUSTOM HOOKS
// =============================================================================
export const useInvestmentCalculations = (
  selectedDate: Date,
  transactions: Transaction[]
) => {
  return useMemo(() => {
    return InvestmentEngine.calculateInvestments(selectedDate, transactions);
  }, [selectedDate, transactions]);
};
