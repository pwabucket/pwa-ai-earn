import { useMemo } from "react";

import InvestmentEngine from "../lib/InvestmentEngine";
import useActiveAccount from "./useActiveAccount";
import { useTrackerProvider } from "./useTrackerProvider";

/**
 * Builds an InvestmentEngine wired to the active account's provider, so the
 * provider owns the daily rate strategy instead of the engine hardcoding it.
 */
export const useInvestmentEngine = () => {
  const account = useActiveAccount();
  const { getProvider } = useTrackerProvider();

  return useMemo(() => {
    return new InvestmentEngine(getProvider(account.provider));
  }, [account.provider, getProvider]);
};
