import type { StateCreator } from "zustand";

import type { Withdrawal } from "../types/app";

export interface WithdrawalSlice {
  withdrawals: Withdrawal[];
  setWithdrawals: (withdrawals: Withdrawal[]) => void;
  addWithdrawal: (withdrawal: Withdrawal) => void;
  removeWithdrawal: (withdrawalId: string) => void;
  updateWithdrawal: (
    withdrawalId: string,
    updatedWithdrawal: Withdrawal
  ) => void;
  clearWithdrawals: () => void;
}

export const createWithdrawalSlice: StateCreator<WithdrawalSlice> = (set) => ({
  withdrawals: [],
  setWithdrawals: (withdrawals) => set({ withdrawals }),
  addWithdrawal: (withdrawal) =>
    set((state) => ({
      withdrawals: [...state.withdrawals, withdrawal],
    })),
  removeWithdrawal: (withdrawalId) =>
    set((state) => ({
      withdrawals: state.withdrawals.filter(
        (withdrawal) => withdrawal.id !== withdrawalId
      ),
    })),
  updateWithdrawal: (withdrawalId, updatedWithdrawal) =>
    set((state) => ({
      withdrawals: state.withdrawals.map((withdrawal) =>
        withdrawal.id === withdrawalId ? updatedWithdrawal : withdrawal
      ),
    })),
  clearWithdrawals: () => set({ withdrawals: [] }),
});
