export const createWithdrawalSlice = (set) => ({
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
