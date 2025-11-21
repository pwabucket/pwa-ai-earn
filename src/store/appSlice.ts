import type { StateCreator } from "zustand/vanilla";
import type { Account, Transaction } from "../types/app";

export interface AppSlice {
  activeAccountId: string | null;
  setActiveAccountId: (accountId: string | null) => void;

  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  updateAccount: (accountId: string, updatedAccount: Partial<Account>) => void;
  removeAccount: (accountId: string) => void;

  setTransactions: (accountId: string, transactions: Transaction[]) => void;
  addTransaction: (accountId: string, transaction: Transaction) => void;
  updateTransaction: (
    accountId: string,
    transactionId: string,
    updatedTransaction: Transaction
  ) => void;
  removeTransaction: (accountId: string, transactionId: string) => void;
}

export const createAppSlice: StateCreator<AppSlice> = (set) => ({
  activeAccountId: "default-account",
  setActiveAccountId: (accountId) => set({ activeAccountId: accountId }),

  accounts: [
    {
      id: "default-account",
      title: "Default Account",
      transactions: [],
    },
  ],
  setAccounts: (accounts) => set({ accounts }),
  addAccount: (account) =>
    set((state) => ({
      accounts: [...state.accounts, account],
    })),
  updateAccount: (accountId, updatedAccount) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === accountId ? { ...account, ...updatedAccount } : account
      ),
    })),
  removeAccount: (accountId) =>
    set((state) => ({
      accounts: state.accounts.filter((account) => account.id !== accountId),
    })),

  setTransactions: (accountId, transactions) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === accountId ? { ...account, transactions } : account
      ),
    })),
  addTransaction: (accountId, transaction) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === accountId
          ? {
              ...account,
              transactions: [...account.transactions, transaction],
            }
          : account
      ),
    })),
  updateTransaction: (accountId, transactionId, updatedTransaction) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === accountId
          ? {
              ...account,
              transactions: account.transactions.map((transaction) =>
                transaction.id === transactionId
                  ? { ...transaction, ...updatedTransaction }
                  : transaction
              ),
            }
          : account
      ),
    })),
  removeTransaction: (accountId, transactionId) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === accountId
          ? {
              ...account,
              transactions: account.transactions.filter(
                (transaction) => transaction.id !== transactionId
              ),
            }
          : account
      ),
    })),
});
