import { useMemo } from "react";
import InvestmentEngine from "../lib/InvestmentEngine";
import { cn, formatCurrency } from "../lib/utils";
import { formatDate } from "../utils/dateUtils";

export const ActiveInvestments = ({
  selectedDate,
  onSelectDate,
  investments,
}) => {
  const list = useMemo(
    () =>
      investments
        .map((investment) => {
          const startDate = new Date(investment.date);
          const endDate = new Date(investment.date);
          endDate.setDate(
            endDate.getDate() + InvestmentEngine.INVESTMENT_DURATION
          );
          const duration = InvestmentEngine.getDaysDifference(
            startDate,
            selectedDate
          );

          return {
            ...investment,
            startDate,
            endDate,
            duration,
          };
        })
        .sort((a, b) => a.duration - b.duration),
    [investments, selectedDate]
  );
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-neutral-800">
      <h1 className="font-bold">Active Investments</h1>
      {list.length > 0 ? (
        list.map((investment, index) => (
          <InvestmentItem
            key={index}
            investment={investment}
            onSelectDate={onSelectDate}
          />
        ))
      ) : (
        <div className="text-neutral-400">No active investments</div>
      )}
    </div>
  );
};
export const InvestmentItem = ({ investment, onSelectDate }) => {
  const max = 20;
  const progress = Math.min(investment.duration, max);
  const radius = 18;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (progress / max) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-10 shrink-0">
        <svg height="40" width="40">
          <circle
            stroke="#404040"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="20"
            cy="20"
          />
          <circle
            stroke="#ec4899"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            r={normalizedRadius}
            cx="20"
            cy="20"
            style={{ transition: "stroke-dashoffset 0.5s" }}
          />
        </svg>
        <span
          className={cn(
            "absolute inset-0",
            "flex items-center justify-center font-bold text-xs"
          )}
        >
          {investment.duration}
        </span>
      </div>

      <div className="text-sm grow min-w-0">
        <p className="text-neutral-300 flex justify-between">
          Started:{" "}
          <button
            className="text-pink-500 cursor-pointer"
            onClick={() => onSelectDate(investment.startDate)}
          >
            {formatDate(investment.startDate)}
          </button>
        </p>
        <p className="text-neutral-300 flex justify-between">
          Ends:{" "}
          <button
            className="text-pink-500 cursor-pointer"
            onClick={() => onSelectDate(investment.endDate)}
          >
            {formatDate(investment.endDate)}
          </button>
        </p>
      </div>
      <div className="font-bold text-green-500">
        {formatCurrency(investment.amount)}
      </div>
    </div>
  );
};
