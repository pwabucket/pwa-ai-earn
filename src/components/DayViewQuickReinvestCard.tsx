import { LuRefreshCw } from "react-icons/lu";

import Currency from "./Currency";
import { cn } from "../lib/utils";
import { memo } from "react";
import Decimal from "decimal.js";

export const DayViewQuickReinvestCard = memo(
  ({
    totalBalance,
    onReinvest,
  }: {
    totalBalance: Decimal.Value;
    onReinvest: (amount: Decimal.Value) => void;
  }) => {
    if (new Decimal(totalBalance).lessThan(1)) return null;

    return (
      <div className="flex flex-col items-start gap-2 p-4 bg-neutral-800 rounded-xl">
        <p>
          You have an available balance of{" "}
          <Currency className="text-green-500 font-bold" value={totalBalance} />
        </p>
        <button
          className={cn(
            "bg-pink-500 hover:bg-pink-600",
            "px-4 py-2 rounded-xl text-sm font-bold cursor-pointer",
            "flex items-center gap-2"
          )}
          onClick={() => onReinvest(new Decimal(totalBalance))}
        >
          <LuRefreshCw className="size-4" />
          Quick Reinvest
        </button>
      </div>
    );
  }
);
