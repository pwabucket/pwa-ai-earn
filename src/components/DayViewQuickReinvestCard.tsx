import { LuRefreshCw } from "react-icons/lu";

import Currency from "./Currency";
import { cn } from "../lib/utils";

// =============================================================================
// QUICK REINVEST COMPONENT
// =============================================================================
export const DayViewQuickReinvestCard = ({
  totalBalance,
  onReinvest,
}: {
  totalBalance: number;
  onReinvest: (amount: string | number) => void;
}) => {
  if (totalBalance < 1) return null;

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
        onClick={() => onReinvest(totalBalance)}
      >
        <LuRefreshCw className="size-4" />
        Quick Reinvest
      </button>
    </div>
  );
};
