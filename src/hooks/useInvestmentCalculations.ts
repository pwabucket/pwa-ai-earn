import { useMemo } from "react";

import InvestmentEngine from "../lib/InvestmentEngine";
import type { Investment, Withdrawal } from "../types/app";

// =============================================================================
// CUSTOM HOOKS
// =============================================================================
export const useInvestmentCalculations = (
  selectedDate: Date,
  investments: Investment[],
  withdrawals: Withdrawal[]
) => {
  return useMemo(() => {
    return InvestmentEngine.calculateInvestments(
      selectedDate,
      investments,
      withdrawals
    );
  }, [selectedDate, investments, withdrawals]);
};
