import { LuPin, LuPinOff, LuX } from "react-icons/lu";

import Currency from "./Currency";
import { cn } from "../lib/utils";
import { memo } from "react";
import type { Transaction } from "../types/app";

const DayViewTransactionButton = (props: React.ComponentProps<"button">) => (
  <button
    {...props}
    className={cn(
      "p-2 rounded-xl bg-neutral-700 hover:bg-neutral-600",
      "transition-colors cursor-pointer shrink-0",
      "text-neutral-300",
      props.className
    )}
  />
);

export const DayViewTransactionItem = memo(
  ({
    transaction,
    onPin,
    onRemove,
  }: {
    transaction: Transaction;
    onPin: () => void;
    onRemove: () => void;
  }) => (
    <div className="flex items-center justify-between gap-1">
      <div className="grow min-w-0">
        <div className="text-xs text-neutral-400">
          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </div>
        <div
          className={
            {
              earnings: "text-green-400",
              investment: "text-blue-400",
              withdrawal: "text-red-400",
              exchange: "text-yellow-400",
            }[transaction.type]
          }
        >
          <Currency
            prefix={transaction.type === "withdrawal" ? "-" : "+"}
            value={transaction.amount}
          />
        </div>
      </div>
      {transaction.type !== "earnings" && (
        <>
          <DayViewTransactionButton
            onClick={onPin}
            title="Pin/Unpin Transaction"
            className={transaction.pinned ? "text-yellow-400" : ""}
          >
            {transaction.pinned ? (
              <LuPin className="size-5" />
            ) : (
              <LuPinOff className="size-5" />
            )}
          </DayViewTransactionButton>

          {/* Remove transaction */}
          <DayViewTransactionButton
            title="Remove Transaction"
            onClick={onRemove}
          >
            <LuX className="size-5" />
          </DayViewTransactionButton>
        </>
      )}
    </div>
  )
);
