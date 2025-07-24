import { Dialog } from "radix-ui";
import { LuCalendar, LuPlay, LuX } from "react-icons/lu";
import { startOfDay } from "date-fns";
import { useMemo } from "react";
import { useState } from "react";

import CalendarModal from "./CalendarModal";
import InvestmentEngine from "../lib/InvestmentEngine";
import Modal from "./Modal";
import useAppStore from "../store/useAppStore";
import useLocationToggle from "../hooks/useLocationToggle";
import { ActiveInvestments } from "./ActiveInvestments";
import { DayNavigator } from "./DayNavigator";
import { HeaderButton } from "./HeaderButton";
import { cn, formatCurrency } from "../lib/utils";
import { formatDate } from "../utils/dateUtils";

const ResultInfo = ({ label, children }) => (
  <div className="flex flex-col-reverse">
    <h3 className="text-xs text-neutral-400">{label}</h3>
    <p>{children}</p>
  </div>
);

const SimulationResult = ({
  selectedDate,
  targetDate,
  onChangeTargetDate,
  onClose,
}) => {
  const investments = useAppStore((state) => state.investments);
  const withdrawals = useAppStore((state) => state.withdrawals);

  const result = useMemo(() => {
    return InvestmentEngine.simulateInvestments(
      selectedDate,
      targetDate,
      investments,
      withdrawals
    );
  }, [selectedDate, targetDate, investments, withdrawals]);

  return (
    <Modal onOpenChange={onClose}>
      <div className="flex items-center justify-between gap-1">
        <div className="flex flex-col grow min-w-0">
          <Dialog.Title className="font-bold">Result</Dialog.Title>
          <Dialog.Description className="text-sm text-neutral-400">
            Simulations to:{" "}
            <span className="text-pink-500">{formatDate(targetDate)}</span>
          </Dialog.Description>
        </div>
        <DayNavigator
          selectedDate={targetDate}
          onDateChange={onChangeTargetDate}
        />
        <Dialog.Close asChild>
          <HeaderButton>
            <LuX className="size-5" />
          </HeaderButton>
        </Dialog.Close>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <p className="text-sm text-neutral-400">
          The following are the results if you compound your investments:
        </p>

        {/* Withdrawable Amount */}
        <ResultInfo label={"Withdrawable Amount"}>
          <span className="text-green-500">
            {formatCurrency(result.totalWithdrawableAfterExpiry)}
          </span>
        </ResultInfo>

        {/* Amount Invested */}
        <ResultInfo label={"Amount Invested"}>
          <span className="text-green-500">
            {formatCurrency(result.finalState.totalInvested)}
          </span>
        </ResultInfo>

        {/* Last Withdrawal Date */}
        <ResultInfo label={"Last Withdrawal Date"}>
          <span className="text-pink-500">
            {formatDate(result.allInvestmentsExpireDate)}
          </span>
        </ResultInfo>

        {/* Simulation Days */}
        <ResultInfo label={"Simulation Days"}>
          <span className="text-pink-500">{result.simulationDays} days</span>
        </ResultInfo>

        <ActiveInvestments
          selectedDate={targetDate}
          investments={result.finalState.currentActiveInvestments}
          onSelectDate={onChangeTargetDate}
        />
      </div>
    </Modal>
  );
};

export default function Simulation({ selectedDate }) {
  const [targetDate, setTargetDate] = useState(() => startOfDay(selectedDate));
  const [showCalendar, toggleShowCalendar] = useLocationToggle(
    "simulation-calendar"
  );

  const [showResults, toggleShowResults] =
    useLocationToggle("simulation-results");

  return (
    <>
      <div className="flex flex-col gap-2 p-4 bg-neutral-800 rounded-xl">
        <h2 className="text-lg font-bold">Simulation</h2>
        <p className="text-neutral-400 text-sm">
          Simulate your investment growth over time. Results are based on your
          current investments and withdrawals.
        </p>
        <button
          onClick={() => toggleShowCalendar(true)}
          className={cn(
            "font-bold  text-sm cursor-pointer text-neutral-100",
            "p-2 rounded-xl bg-neutral-700 hover:bg-neutral-600",
            "flex items-center justify-center gap-2"
          )}
        >
          <LuCalendar className="size-5" />

          {targetDate ? (
            <>
              Select Date:{" "}
              <span className="text-pink-500">{formatDate(targetDate)}</span>
            </>
          ) : (
            "Select Date"
          )}
        </button>

        <button
          onClick={() => targetDate && toggleShowResults(true)}
          className={cn(
            "cursor-pointer font-bold text-purple-500 text-sm",
            "p-2 rounded-xl bg-neutral-700 hover:bg-neutral-600",
            "flex items-center justify-center gap-2"
          )}
        >
          <LuPlay className="size-5" />
          Simulate
        </button>
      </div>

      {showCalendar && (
        <CalendarModal
          onSelectDate={(date) => {
            setTargetDate(date);
          }}
          onClose={() => toggleShowCalendar(false)}
        />
      )}

      {targetDate && showResults && (
        <SimulationResult
          selectedDate={selectedDate}
          targetDate={targetDate}
          onChangeTargetDate={setTargetDate}
          onClose={() => toggleShowResults(false)}
        />
      )}
    </>
  );
}
