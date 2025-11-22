import { Virtuoso } from "react-virtuoso";
import {
  LuTrendingUp,
  LuWallet,
  LuRepeat,
  LuCoins,
  LuBanknote,
} from "react-icons/lu";

import Currency from "./Currency";
import Radius from "./Radius";
import { formatDate } from "../utils/dateUtils";
import { cn } from "../lib/utils";
import type InvestmentEngine from "../lib/InvestmentEngine";

type TimelineDay = ReturnType<
  (typeof InvestmentEngine)["simulateInvestments"]
>["timeline"][number];

export default function Timeline({ timeline }: { timeline: TimelineDay[] }) {
  return (
    <div className="flex flex-col gap-2">
      <Virtuoso
        style={{ height: "400px" }}
        data={timeline}
        itemContent={(index, day) => (
          <div className="pb-2 px-1">
            <div
              key={index}
              className="flex gap-3 p-3 bg-neutral-800 rounded-xl"
            >
              <div className="shrink-0 flex flex-col items-center gap-1">
                <Radius
                  max={timeline.length}
                  position={day.index}
                  className={
                    day.compound ? "stroke-pink-500" : "stroke-green-500"
                  }
                />

                {/* Profit day index */}
                {!day.compound && (
                  <span
                    className={cn(
                      "text-xs font-bold border-t-3 border-green-400 ",
                      "flex items-center justify-center size-6",
                      "text-green-400"
                    )}
                  >
                    {day.profitDayIndex}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 grow min-w-0">
                <h4 className="text-sm text-pink-500 font-bold">
                  {formatDate(day.date)}
                </h4>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-purple-400 flex items-center gap-1">
                    <LuCoins className="size-4 shrink-0" />
                    TP: <Currency value={day.activeInvestments} />
                  </span>
                  <span className="text-sm text-blue-400 flex items-center gap-1">
                    <LuWallet className="size-4 shrink-0" />
                    Invested: <Currency value={day.totalInvested} />
                  </span>
                  <span className="text-sm text-yellow-400 flex items-center gap-1">
                    <LuRepeat className="size-4 shrink-0" />
                    Exchanged: <Currency value={day.balanceExchanged} />
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 shrink-0 text-right">
                <span className="text-sm text-lime-400 flex items-center justify-end gap-1">
                  <Currency value={day.currentDailyProfit} prefix="+" />
                  <LuTrendingUp className="size-4 shrink-0" />
                </span>
                <span className="text-sm text-green-400 flex items-center justify-end gap-1">
                  <Currency value={day.availableBalance} />
                  <LuBanknote className="size-4 shrink-0" />
                </span>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
