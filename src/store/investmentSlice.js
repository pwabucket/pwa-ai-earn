export const createInvestmentSlice = (set) => ({
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
  clearInvestments: () => set({ investments: [] }),
});
