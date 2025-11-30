import { Dialog, Tabs } from "radix-ui";
import { LuCalendar, LuPlay, LuX, LuListPlus } from "react-icons/lu";
import { startOfDay } from "date-fns";
import { useCallback, useMemo } from "react";
import { useState } from "react";

import CalendarModal from "./CalendarModal";
import Currency from "./Currency";
import InvestmentEngine from "../lib/InvestmentEngine";
import Modal from "./Modal";
import Timeline from "./Timeline";
import useLocationToggle from "../hooks/useLocationToggle";
import { ActiveInvestments } from "./ActiveInvestments";
import { DayNavigator } from "./DayNavigator";
import { HeaderButton } from "./HeaderButton";
import { TabTriggerButton } from "./TabTriggerButton";
import { cn } from "../lib/utils";
import { formatDate } from "../utils/dateUtils";
import useActiveAccount from "../hooks/useActiveAccount";
import useAppStore from "../store/useAppStore";
import toast from "react-hot-toast";
import type { Transaction } from "../types/app";

const ResultInfo = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
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
  onSelectDate,
}: {
  selectedDate: Date;
  targetDate: Date;
  onChangeTargetDate: (date: Date) => void;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}) => {
  const account = useActiveAccount();
  const { transactions } = account;
  const setTransactions = useAppStore((state) => state.setTransactions);

  const result = useMemo(() => {
    return InvestmentEngine.simulateInvestments(
      selectedDate,
      targetDate,
      transactions
    );
  }, [selectedDate, targetDate, transactions]);

  const fillTransactions = useCallback(() => {
    const newTransactions: Transaction[] = [
      ...transactions,
      ...result.simulatedTransactions.map((tx) => ({
        id: crypto.randomUUID(),
        type: tx.type,
        amount: tx.amount,
        date: tx.date,
      })),
    ];
    setTransactions(account.id, newTransactions);
    onSelectDate(targetDate);
    onClose();
    toast.success("Transactions filled successfully!");
  }, [
    account,
    result,
    transactions,
    targetDate,
    setTransactions,
    onClose,
    onSelectDate,
  ]);

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
          The following are the results if you reinvest your earnings:
        </p>

        {/* Withdrawable Amount */}
        <ResultInfo label={"Withdrawable Amount"}>
          <Currency
            className="text-green-400"
            value={result.totalWithdrawableAfterExpiry}
          />
        </ResultInfo>

        {/* Amount Invested */}
        <ResultInfo label={"Amount Invested"}>
          <Currency
            className="text-blue-400"
            value={result.finalState.totalInvested}
          />
        </ResultInfo>

        {/* Last Withdrawal Date */}
        <ResultInfo label={"Last Withdrawal Date"}>
          <span className="text-pink-500">
            {formatDate(result.allInvestmentsExpireDate)}
          </span>
        </ResultInfo>

        {/* Simulation Days */}
        <ResultInfo label={"Simulation Days"}>
          <span className="text-teal-400">{result.simulationDays} days</span>
        </ResultInfo>

        {/* Fill Transactions */}
        <button
          onClick={fillTransactions}
          className={cn(
            "p-2 bg-neutral-800 text-pink-500 font-bold",
            "flex items-center justify-center gap-2",
            "cursor-pointer rounded-xl hover:bg-neutral-700"
          )}
        >
          <LuListPlus className="size-5" />
          Fill Transactions
        </button>

        <Tabs.Root
          defaultValue="active-investments"
          className="flex flex-col gap-2"
        >
          <Tabs.List className="grid grid-cols-2 gap-1">
            <TabTriggerButton value="active-investments">
              Active Investments
            </TabTriggerButton>
            <TabTriggerButton value="timeline">Timeline</TabTriggerButton>
          </Tabs.List>

          <Tabs.Content value="active-investments">
            <ActiveInvestments
              selectedDate={targetDate}
              investments={result.finalState.currentActiveInvestments}
              onSelectDate={onChangeTargetDate}
            />
          </Tabs.Content>

          <Tabs.Content value="timeline">
            <Timeline timeline={result.timeline} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </Modal>
  );
};

export default function Simulation({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) {
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
          selectedDate={targetDate}
          onSelectDate={setTargetDate}
          onClose={() => toggleShowCalendar(false)}
        />
      )}

      {targetDate && showResults && (
        <SimulationResult
          selectedDate={selectedDate}
          targetDate={targetDate}
          onSelectDate={onSelectDate}
          onChangeTargetDate={setTargetDate}
          onClose={() => toggleShowResults(false)}
        />
      )}
    </>
  );
}
