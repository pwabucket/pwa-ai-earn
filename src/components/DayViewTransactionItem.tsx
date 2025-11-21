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
  type: "earnings" | "investment" | "withdrawal" | "exchange";
  onRemove: () => void;
}) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="text-xs text-neutral-400">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
      <div
        className={
          {
            earnings: "text-green-400",
            investment: "text-blue-400",
            withdrawal: "text-red-400",
            exchange: "text-yellow-400",
          }[type]
        }
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
