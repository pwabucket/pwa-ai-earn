import {
  LuMaximize2,
  LuMinus,
  LuRefreshCw,
  LuTrendingUp,
} from "react-icons/lu";
import { Tabs } from "radix-ui";
import { useCallback, useMemo, useState } from "react";

import Currency from "./Currency";
import InvestmentEngine from "../lib/InvestmentEngine";
import PageContainer from "./PageContainer";
import Simulation from "./Simulation";
import useAppStore from "../store/useAppStore";
import { ActiveInvestments } from "./ActiveInvestments";
import { DayViewCurrencyInput } from "./DayViewCurrencyInput";
import { DayViewQuickReinvestCard } from "./DayViewQuickReinvestCard";
import { DayViewTransactionsList } from "./DayViewTransactionsList";
import { TabTriggerButton } from "./TabTriggerButton";
import { cn } from "../lib/utils";
import { formatDate } from "../utils/dateUtils";
import { useInvestmentCalculations } from "../hooks/useInvestmentCalculations";
import { useTodayTransactions } from "../hooks/useTodayTransactions";
import useActiveAccount from "../hooks/useActiveAccount";
import { Decimal } from "decimal.js";
import type { Transaction } from "../types/app";

const ActionButton = ({
  variant = "primary",
  ...props
}: React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
}) => (
  <button
    {...props}
    className={cn(
      "px-4 py-2 rounded-xl text-sm shrink-0 cursor-pointer",
      "flex items-center justify-center gap-2",
      variant === "primary" && "bg-neutral-800 text-pink-500",
      variant === "secondary" && "bg-neutral-800 text-green-500",
      props.className
    )}
  />
);

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

const InputSection = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2">{children}</div>
);

const ButtonGroup = ({
  children,
  columns = 2,
}: {
  children: React.ReactNode;
  columns?: number;
}) => (
  <div className={cn("grid gap-2", { 2: "grid-cols-2" }[columns])}>
    {children}
  </div>
);

// =============================================================================
// METRICS DISPLAY COMPONENT
// =============================================================================

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

const MetricsDisplay = ({
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

// =============================================================================
// TAB CONTENT COMPONENTS
// =============================================================================

const InvestTab = ({
  investmentAmount,
  setInvestmentAmount,
  handleInvest,
  endDate,
  onSelectDate,
}: {
  investmentAmount: string;
  setInvestmentAmount: (amount: string) => void;
  handleInvest: () => void;
  endDate: Date;
  onSelectDate: (date: Date) => void;
}) => (
  <Tabs.Content value="invest" className="flex flex-col gap-2">
    <InputSection>
      <DayViewCurrencyInput
        value={investmentAmount}
        onChange={(value) => setInvestmentAmount(value)}
      />
      <ActionButton onClick={handleInvest}>
        <LuTrendingUp className="size-4" />
        Invest
      </ActionButton>
    </InputSection>

    <p className="text-center text-sm text-neutral-400">
      Ends:{" "}
      <button
        onClick={() => onSelectDate(endDate)}
        className="text-pink-500 cursor-pointer"
      >
        {formatDate(endDate)}
      </button>
    </p>
  </Tabs.Content>
);

const WithdrawTab = ({
  withdrawalAmount,
  setWithdrawalAmount,
  handleMaxWithdrawal,
  handleWithdraw,
  handleReInvest,
}: {
  withdrawalAmount: string;
  setWithdrawalAmount: (amount: string) => void;
  handleMaxWithdrawal: () => void;
  handleWithdraw: () => void;
  handleReInvest: () => void;
}) => (
  <Tabs.Content value="withdraw" className="flex flex-col gap-2">
    <InputSection>
      <DayViewCurrencyInput
        value={withdrawalAmount}
        onChange={setWithdrawalAmount}
      />
      <ActionButton onClick={handleMaxWithdrawal}>
        <LuMaximize2 className="size-4" />
        Max
      </ActionButton>
    </InputSection>

    <ButtonGroup>
      <ActionButton onClick={handleReInvest} variant="secondary">
        <LuRefreshCw className="size-4" />
        Re-Invest
      </ActionButton>
      <ActionButton onClick={handleWithdraw}>
        <LuMinus className="size-4" />
        Withdraw
      </ActionButton>
    </ButtonGroup>
  </Tabs.Content>
);

const SimulateTab = ({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) => (
  <Tabs.Content value="simulate" className="flex flex-col gap-2">
    <Simulation selectedDate={selectedDate} onSelectDate={onSelectDate} />
  </Tabs.Content>
);

const useInvestmentEndDate = (selectedDate: Date) => {
  return useMemo(() => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + InvestmentEngine.INVESTMENT_DURATION);
    return date;
  }, [selectedDate]);
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function DayView({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) {
  /* Store state */
  const account = useActiveAccount();
  const transactions = account.transactions;
  const addTransaction = useAppStore((state) => state.addTransaction);
  const removeTransaction = useAppStore((state) => state.removeTransaction);
  const updateTransaction = useAppStore((state) => state.updateTransaction);

  /* Calculations */
  const result = useInvestmentCalculations(selectedDate, transactions);
  const todayTransactions = useTodayTransactions(
    selectedDate,
    transactions,
    result.currentState.todaysProfit
  );
  const endDate = useInvestmentEndDate(selectedDate);

  /* Local state */
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");

  /* Handle Add Transaction */
  const addAccountTransaction = useCallback(
    (type: Transaction["type"], amount: Decimal.Value) => {
      addTransaction(account.id, {
        id: crypto.randomUUID(),
        date: selectedDate,
        amount: new Decimal(amount),
        type,
      });
    },
    [account.id, selectedDate, addTransaction]
  );

  /* Handle Re-Investment */
  const reinvest = useCallback(
    (amount: Decimal.Value) => addAccountTransaction("exchange", amount),
    [addAccountTransaction]
  );

  /* Handle Remove Transaction */
  const removeAccountTransaction = useCallback(
    (transactionId: string) => {
      removeTransaction(account.id, transactionId);
    },
    [removeTransaction, account.id]
  );

  /* Handle Pin Transaction */
  const pinAccountTransaction = useCallback(
    (transactionId: string, pinned: boolean) => {
      updateTransaction(account.id, transactionId, { pinned });
    },
    [updateTransaction, account.id]
  );

  /* Handle Investment Transaction */
  const addInvestmentTransaction = useCallback(
    (amount: Decimal.Value) => addAccountTransaction("investment", amount),
    [addAccountTransaction]
  );

  /* Handle Withdrawal Transaction */
  const addWithdrawalTransaction = useCallback(
    (amount: Decimal.Value) => addAccountTransaction("withdrawal", amount),
    [addAccountTransaction]
  );

  /* Handle Invest */
  const handleInvest = useCallback(() => {
    if (new Decimal(investmentAmount.toString()).greaterThanOrEqualTo(1)) {
      addInvestmentTransaction(new Decimal(investmentAmount));
      setInvestmentAmount("");
    }
  }, [addInvestmentTransaction, investmentAmount]);

  /* Handle Withdraw */
  const handleWithdraw = useCallback(() => {
    if (withdrawalAmount) {
      addWithdrawalTransaction(new Decimal(withdrawalAmount));
      setWithdrawalAmount("");
    }
  }, [addWithdrawalTransaction, withdrawalAmount]);

  /* Handle Re-Invest */
  const handleReInvest = useCallback(() => {
    if (withdrawalAmount) {
      reinvest(withdrawalAmount);
      setWithdrawalAmount("");
    }
  }, [reinvest, withdrawalAmount]);

  /* Handle Max Withdrawal */
  const handleMaxWithdrawal = useCallback(() => {
    setWithdrawalAmount(result.currentState.totalBalance.toFixed(4));
  }, [result.currentState.totalBalance]);

  return (
    <PageContainer className="flex flex-col gap-4 px-2 py-4">
      {/* Metrics Display */}
      <MetricsDisplay
        result={result}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />

      {/* Quick Reinvest Card */}
      <DayViewQuickReinvestCard
        totalBalance={result.currentState.totalBalance}
        onReinvest={reinvest}
      />

      {/* Action Tabs */}
      <Tabs.Root defaultValue="invest" className="flex flex-col gap-2">
        <Tabs.List className="grid grid-cols-3 gap-1">
          <TabTriggerButton value="invest">Invest</TabTriggerButton>
          <TabTriggerButton value="withdraw">Withdraw</TabTriggerButton>
          <TabTriggerButton value="simulate">Simulate</TabTriggerButton>
        </Tabs.List>

        <InvestTab
          investmentAmount={investmentAmount}
          setInvestmentAmount={setInvestmentAmount}
          handleInvest={handleInvest}
          endDate={endDate}
          onSelectDate={onSelectDate}
        />

        <WithdrawTab
          withdrawalAmount={withdrawalAmount}
          setWithdrawalAmount={setWithdrawalAmount}
          handleMaxWithdrawal={handleMaxWithdrawal}
          handleWithdraw={handleWithdraw}
          handleReInvest={handleReInvest}
        />

        <SimulateTab onSelectDate={onSelectDate} selectedDate={selectedDate} />
      </Tabs.Root>

      {/* Today's Transactions */}
      <DayViewTransactionsList
        title="Today's transactions"
        transactions={todayTransactions}
        onPinTransaction={pinAccountTransaction}
        onRemoveTransaction={removeAccountTransaction}
      />

      {/* Active Investments */}
      <ActiveInvestments
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        investments={result.currentState.currentActiveInvestments}
      />
    </PageContainer>
  );
}
