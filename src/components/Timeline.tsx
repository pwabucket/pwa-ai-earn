import Currency from "./Currency";
import Radius from "./Radius";
import { formatDate } from "../utils/dateUtils";

interface TimelineDay {
  index: number;
  date: Date;
  compound: boolean;
  availableBalance: number;
  totalInvested: number;
  activeInvestments: number;
  balanceReinvested: number;
  currentDailyProfit: number;
}

export default function Timeline({ timeline }: { timeline: TimelineDay[] }) {
  return (
    <div className="flex flex-col gap-2">
      {timeline.map((day, index) => (
        <div key={index} className="flex gap-2 p-4 bg-neutral-800 rounded-xl">
          <Radius
            max={timeline.length}
            position={day.index}
            className={day.compound ? "stroke-pink-500" : "stroke-green-500"}
          />
          <div className="flex flex-col gap-2 grow min-w-0">
            <h4 className="text-sm text-pink-500 font-bold">
              {formatDate(day.date)}
            </h4>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-purple-400">
                TP: <Currency value={day.activeInvestments} />
              </span>
              <span className="text-sm text-blue-400">
                Invested: <Currency value={day.totalInvested} />
              </span>
              <span className="text-sm text-yellow-400">
                Reinvested: <Currency value={day.balanceReinvested} />
              </span>

              <span className="text-sm text-green-400">
                Daily Profit:{" "}
                <Currency value={day.currentDailyProfit} prefix="+" />
              </span>
              <span className="text-sm text-green-400">
                Balance: <Currency value={day.availableBalance} />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
