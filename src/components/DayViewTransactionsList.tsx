import { DayViewTransactionItem } from "./DayViewTransactionItem";
import { memo } from "react";
import type { Transaction } from "../types/app";

export const DayViewTransactionsList = memo(
  ({
    title,
    transactions,
    onPinTransaction,
    onRemoveTransaction,
  }: {
    title: string;
    transactions: Transaction[];
    onPinTransaction: (id: string, pinned: boolean) => void;
    onRemoveTransaction: (id: string) => void;
  }) => (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-neutral-800">
      <h1 className="font-bold">{title}</h1>
      {transactions.length > 0 ? (
        transactions.map((transaction, index) => (
          <DayViewTransactionItem
            key={index}
            transaction={transaction}
            onPin={() => onPinTransaction(transaction.id, !transaction.pinned)}
            onRemove={() => onRemoveTransaction(transaction.id)}
          />
        ))
      ) : (
        <div className="text-neutral-400">No transactions found</div>
      )}
    </div>
  )
);
