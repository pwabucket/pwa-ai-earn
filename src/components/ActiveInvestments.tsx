import { useMemo } from "react";
import Currency from "./Currency";
import Radius from "./Radius";
import type { Transaction } from "../types/app";
import { formatDate } from "../utils/dateUtils";
import { useInvestmentEngine } from "../hooks/useInvestmentEngine";

export const ActiveInvestments = ({
  selectedDate,
  onSelectDate,
  investments,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  investments: Transaction[];
}) => {
  const engine = useInvestmentEngine();

  const list = useMemo(
    () =>
      investments
        .map((investment) => {
          const startDate = new Date(investment.date);
          const endDate = engine.getInvestmentExpiryDate(investment);
          const totalDuration = engine.getInvestmentDuration(investment);
          const elapsedDays = engine.getDaysDifference(
            startDate,
            selectedDate
          );

          return {
            ...investment,
            startDate,
            endDate,
            totalDuration,
            elapsedDays,
          };
        })
        .sort((a, b) => a.elapsedDays - b.elapsedDays),
    [engine, investments, selectedDate]
  );
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-neutral-800">
      <h1 className="font-bold">Active Investments</h1>
      {list.length > 0 ? (
        <div className="grid grid-cols-[minmax(0,1fr)_max-content] gap-2">
          {list.map((investment, index) => (
            <InvestmentItem
              key={index}
              investment={investment}
              onSelectDate={onSelectDate}
            />
          ))}
        </div>
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
    totalDuration: number;
    elapsedDays: number;
    startDate: Date;
    endDate: Date;
  };
  onSelectDate: (date: Date) => void;
}) => {
  const max = investment.totalDuration;
  const progress = Math.min(investment.elapsedDays, max);

  return (
    <>
      <div className="flex items-center gap-2">
        <Radius max={max} position={progress} label={`${progress}/${max}`} />

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
      </div>
      <div className="text-sm font-bold text-green-500 flex items-center">
        <Currency value={investment.amount} />
      </div>
    </>
  );
};
