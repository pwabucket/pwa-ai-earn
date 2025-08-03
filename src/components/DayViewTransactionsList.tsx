import { DayViewTransactionItem } from "./DayViewTransactionItem";
import type { Investment, Withdrawal } from "../types/app";
import type { useTodayTransactions } from "../hooks/useTodayTransactions";

export const DayViewTransactionsList = ({
  title,
  transactions,
  onRemoveInvestment,
  onRemoveWithdrawal,
}: {
  title: string;
  transactions: ReturnType<typeof useTodayTransactions>;
  onRemoveInvestment: (id: string) => void;
  onRemoveWithdrawal: (id: string) => void;
}) => (
  <div className="flex flex-col gap-2 p-4 rounded-xl bg-neutral-800">
    <h1 className="font-bold">{title}</h1>
    {transactions.length > 0 ? (
      transactions.map((transaction, index) => (
        <DayViewTransactionItem
          key={index}
          amount={transaction.amount}
          type={transaction.type as "investment" | "earnings" | "withdrawal"}
          onRemove={() => {
            if (transaction.type === "investment") {
              onRemoveInvestment((transaction as Investment).id);
            } else {
              onRemoveWithdrawal((transaction as Withdrawal).id);
            }
          }}
        />
      ))
    ) : (
      <div className="text-neutral-400">No transactions found</div>
    )}
  </div>
);
