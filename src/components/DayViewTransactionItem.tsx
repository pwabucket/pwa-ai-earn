import { LuX } from "react-icons/lu";

import Currency from "./Currency";
import { cn } from "../lib/utils";

// =============================================================================
// TRANSACTION COMPONENTS
// =============================================================================
export const DayViewTransactionItem = ({
  amount,
  type,
  onRemove,
}: {
  amount: number;
  type: "investment" | "earnings" | "withdrawal";
  onRemove: () => void;
}) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="text-xs text-neutral-400">
        {type === "investment"
          ? "Investment"
          : type === "earnings"
          ? "Earnings"
          : "Withdraw"}
      </div>
      <div
        className={type === "withdrawal" ? "text-red-500" : "text-green-500"}
      >
        <Currency prefix={type === "withdrawal" ? "-" : "+"} value={amount} />
      </div>
    </div>
    {type !== "earnings" && (
      <button
        onClick={onRemove}
        className={cn(
          "p-2 rounded-xl bg-neutral-700 hover:bg-neutral-600",
          "transition-colors cursor-pointer"
        )}
      >
        <LuX className="size-5" />
      </button>
    )}
  </div>
);
