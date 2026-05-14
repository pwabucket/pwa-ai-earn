import { useMemo } from "react";

import { useInvestmentEngine } from "./useInvestmentEngine";

/**
 * End date for a new investment started on the given date, using the engine's
 * default duration.
 */
export const useInvestmentEndDate = (selectedDate: Date) => {
  const engine = useInvestmentEngine();
  return useMemo(() => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + engine.INVESTMENT_DURATION);
    return date;
  }, [engine, selectedDate]);
};
