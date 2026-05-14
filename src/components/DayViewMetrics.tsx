import type { Decimal } from "decimal.js";

import Currency from "./Currency";
import { cn } from "../lib/utils";
import { formatDate } from "../utils/dateUtils";
import { useInvestmentCalculations } from "../hooks/useInvestmentCalculations";

const MetricCard = ({
  title,
  value,
  valueColor = "text-green-500",
}: {
  title: string;
  value: Decimal.Value;
  valueColor?: string;
}) => (
  <div className="flex flex-col items-center bg-neutral-800 rounded-xl py-4">
    <h3 className="text-sm font-semibold">{title}</h3>
    <p className={cn("font-bold text-sm", valueColor)}>
      <Currency value={value} />
    </p>
  </div>
);

const TargetButton = ({
  result,
  selectedDate,
  onSelectDate,
}: {
  result: ReturnType<typeof useInvestmentCalculations>;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) => {
  const targetDate =
    selectedDate <= result.allInvestmentsExpireDate
      ? result.allInvestmentsExpireDate
      : selectedDate;

  const targetValue =
    selectedDate <= result.allInvestmentsExpireDate
      ? result.expiredState.totalBalance
      : 0;

  return (
    <button
      title={`Target: ${formatDate(targetDate)}`}
      onClick={() => onSelectDate(targetDate)}
      className={cn(
        "text-center text-sm text-purple-500 hover:underline cursor-pointer"
      )}
    >
      <span>Target:</span>{" "}
      <Currency value={targetValue} className="font-bold" />
    </button>
  );
};

const MainMetrics = ({
  result,
}: {
  result: ReturnType<typeof useInvestmentCalculations>;
}) => (
  <>
    {/* Active Investments */}
    <h1 className="text-center text-4xl md:text-5xl font-bold my-2">
      <Currency value={result.currentState.activeInvestments} />
    </h1>

    {/* Daily Earnings */}
    <h2 className="text-center text-sm">
      <span className="text-neutral-400">Daily Earn:</span>{" "}
      <Currency
        className="font-bold"
        value={result.currentState.currentDailyProfit}
      />{" "}
      <span className="text-green-500 font-bold">
        (+{result.currentState.currentDailyRate.times(100).toFixed(2)}%)
      </span>
    </h2>

    {/* Today's Profit */}
    <h3 className="text-center text-sm">
      <span className="text-neutral-400">Today:</span>{" "}
      <Currency
        prefix={"+"}
        value={result.currentState.todaysProfit}
        className="font-bold text-green-500"
      />
    </h3>

    {/* Available Balance */}
    <p className="text-center text-sm">
      <span className="text-green-500">Balance:</span>{" "}
      <Currency
        value={result.currentState.totalBalance}
        className="font-bold text-lime-500"
      />
    </p>
  </>
);

const MetricsGrid = ({
  result,
}: {
  result: ReturnType<typeof useInvestmentCalculations>;
}) => (
  <div className="grid grid-cols-3 gap-1">
    <MetricCard
      title="Invested"
      value={result.currentState.totalInvested}
      valueColor="text-green-500"
    />
    <MetricCard
      title="Profits"
      value={result.currentState.totalProfits}
      valueColor="text-green-500"
    />
    <MetricCard
      title="Withdrawn"
      value={result.currentState.totalKept}
      valueColor="text-red-500"
    />
  </div>
);

export const MetricsDisplay = ({
  result,
  selectedDate,
  onSelectDate,
}: {
  result: ReturnType<typeof useInvestmentCalculations>;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) => (
  <>
    <div className="flex flex-col">
      <TargetButton
        result={result}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />

      <MainMetrics result={result} />
    </div>
    <MetricsGrid result={result} />
  </>
);
