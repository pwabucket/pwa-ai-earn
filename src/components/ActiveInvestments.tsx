import { useMemo } from "react";
import Currency from "./Currency";
import InvestmentEngine from "../lib/InvestmentEngine";
import Radius from "./Radius";
import type { Transaction } from "../types/app";
import { formatDate } from "../utils/dateUtils";

export const ActiveInvestments = ({
  selectedDate,
  onSelectDate,
  investments,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  investments: Transaction[];
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
export const InvestmentItem = ({
  investment,
  onSelectDate,
}: {
  investment: Transaction & {
    duration: number;
    startDate: Date;
    endDate: Date;
  };
  onSelectDate: (date: Date) => void;
}) => {
  const max = 20;
  const progress = Math.min(investment.duration, max);

  return (
    <div className="flex items-center gap-2">
      <Radius max={max} position={progress} />

      <div className="text-xs grow min-w-0">
        <p className="text-neutral-300 flex justify-between">
          Starts:{" "}
          <button
            className="text-pink-500 cursor-pointer hover:underline"
            onClick={() => onSelectDate(investment.startDate)}
          >
            {formatDate(investment.startDate)}
          </button>
        </p>
        <p className="text-neutral-300 flex justify-between">
          Ends:{" "}
          <button
            className="text-pink-500 cursor-pointer hover:underline"
            onClick={() => onSelectDate(investment.endDate)}
          >
            {formatDate(investment.endDate)}
          </button>
        </p>
      </div>
      <div className="text-sm font-bold text-green-500">
        <Currency value={investment.amount} />
      </div>
    </div>
  );
};
