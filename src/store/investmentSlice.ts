import type { StateCreator } from "zustand/vanilla";

import InvestmentEngine from "../lib/InvestmentEngine";
import type { Investment } from "../types/app";

export interface InvestmentSlice {
  investments: Investment[];
  setInvestments: (investments: Investment[]) => void;
  addInvestment: (investment: Investment) => void;
  removeInvestment: (investmentId: string) => void;
  updateInvestment: (
    investmentId: string,
    updatedInvestment: Investment
  ) => void;
  removeOldInvestments: () => void;
  clearInvestments: () => void;
}

export const createInvestmentSlice: StateCreator<InvestmentSlice> = (set) => ({
  investments: [],
  setInvestments: (investments) => set({ investments }),
  addInvestment: (investment) =>
    set((state) => ({
      investments: [...state.investments, investment],
    })),
  removeInvestment: (investmentId) =>
    set((state) => ({
      investments: state.investments.filter((inv) => inv.id !== investmentId),
    })),
  updateInvestment: (investmentId, updatedInvestment) =>
    set((state) => ({
      investments: state.investments.map((inv) =>
        inv.id === investmentId ? updatedInvestment : inv
      ),
    })),
  removeOldInvestments: () =>
    set((state) => ({
      investments: state.investments.filter((inv) => {
        const duration = InvestmentEngine.getDaysDifference(
          inv.date,
          new Date()
        );
        const hasExpired = duration > InvestmentEngine.INVESTMENT_DURATION;

        return !hasExpired;
      }),
    })),
  clearInvestments: () => set({ investments: [] }),
});
