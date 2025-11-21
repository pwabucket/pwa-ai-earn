import { DayViewTransactionItem } from "./DayViewTransactionItem";
import type { useTodayTransactions } from "../hooks/useTodayTransactions";

export const DayViewTransactionsList = ({
  title,
  transactions,
  onRemoveTransaction,
}: {
  title: string;
  transactions: ReturnType<typeof useTodayTransactions>;
  onRemoveTransaction: (id: string) => void;
}) => (
  <div className="flex flex-col gap-2 p-4 rounded-xl bg-neutral-800">
    <h1 className="font-bold">{title}</h1>
    {transactions.length > 0 ? (
      transactions.map((transaction, index) => (
        <DayViewTransactionItem
          key={index}
          amount={transaction.amount}
          type={
            transaction.type as
              | "earnings"
              | "investment"
              | "withdrawal"
              | "exchange"
          }
          onRemove={() => onRemoveTransaction(transaction.id)}
        />
      ))
    ) : (
      <div className="text-neutral-400">No transactions found</div>
    )}
  </div>
);
