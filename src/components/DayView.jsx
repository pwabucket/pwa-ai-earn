import {
  LuMaximize2,
  LuMinus,
  LuRefreshCw,
  LuTrendingUp,
  LuX,
} from "react-icons/lu";
import { Tabs } from "radix-ui";
import { useMemo } from "react";
import { useState } from "react";

import Currency from "./Currency";
import Input from "./Input";
import InvestmentEngine from "../lib/InvestmentEngine";
import PageContainer from "./PageContainer";
import Simulation from "./Simulation";
import useAppStore from "../store/useAppStore";
import { ActiveInvestments } from "./ActiveInvestments";
import { cn } from "../lib/utils";
import { formatDate } from "../utils/dateUtils";

const TabTriggerButton = (props) => (
  <Tabs.Trigger
    {...props}
    className={cn(
      "py-2 bg-neutral-800 rounded-xl",
      "text-white font-bold text-sm",
      "cursor-pointer",
      "data-[state=active]:text-pink-500"
    )}
  />
);

const CurrencyInput = ({ value, onChange, placeholder = "1.00" }) => (
  <div className="relative grow min-w-0">
    <span
      className={cn(
        "absolute text-neutral-400 h-full left-0 px-4",
        "flex items-center justify-center"
      )}
    >
      $
    </span>
    <Input
      placeholder={placeholder}
      className="pl-8"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ActionButton = ({
  onClick,
  children,
  variant = "primary",
  className = "",
}) => (
  <button
    className={cn(
      "px-4 py-2 rounded-xl text-sm shrink-0 cursor-pointer",
      "flex items-center justify-center gap-2",
      variant === "primary" && "bg-neutral-800 text-pink-500",
      variant === "secondary" && "bg-neutral-800 text-green-500",
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

const MetricCard = ({ title, value, valueColor = "text-green-500" }) => (
  <div className="flex flex-col items-center bg-neutral-800 rounded-xl py-4">
    <h3 className="text-sm font-semibold">{title}</h3>
    <p className={cn("font-bold", valueColor)}>
      <Currency value={value} />
    </p>
  </div>
);

const InputSection = ({ children }) => (
  <div className="flex items-center gap-2">{children}</div>
);

const ButtonGroup = ({ children, columns = 2 }) => (
  <div className={cn("grid gap-2", { 2: "grid-cols-2" }[columns])}>
    {children}
  </div>
);

const TransactionItem = ({ amount, type, onRemove }) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="text-xs text-neutral-400">
        {type === "investment"
          ? "Investment"
          : type === "earnings"
          ? "Earnings"
          : "Withdraw"}
      </div>
      <div
        className={type === "withdrawal" ? "text-red-500" : "text-green-500"}
      >
        <Currency prefix={type === "withdrawal" ? "-" : "+"} value={amount} />
      </div>
    </div>
    {type !== "earnings" && (
      <button
        onClick={onRemove}
        className={cn(
          "p-2 rounded-xl bg-neutral-700 hover:bg-neutral-600",
          "transition-colors cursor-pointer"
        )}
      >
        <LuX className="size-5" />
      </button>
    )}
  </div>
);

const TransactionsList = ({
  title,
  transactions,
  onRemoveInvestment,
  onRemoveWithdrawal,
}) => (
  <div className="flex flex-col gap-2 p-4 rounded-xl bg-neutral-800">
    <h1 className="font-bold">{title}</h1>
    {transactions.length > 0 ? (
      transactions.map((transaction, index) => (
        <TransactionItem
          key={index}
          amount={transaction.amount}
          type={transaction.type}
          onRemove={() => {
            if (transaction.type === "investment") {
              onRemoveInvestment(transaction.id);
            } else {
              onRemoveWithdrawal(transaction.id);
            }
          }}
        />
      ))
    ) : (
      <div className="text-neutral-400">No transactions found</div>
    )}
  </div>
);

const MetricsDisplay = ({ result }) => (
  <>
    <div className="flex flex-col">
      <h1 className="text-center text-5xl font-bold">
        <Currency value={result.activeInvestments} />
      </h1>
      <h2 className="text-center">
        <span className="text-neutral-400">Daily Earn:</span>{" "}
        <Currency className="font-bold" value={result.currentDailyProfit} />{" "}
        <span className="text-green-500 font-bold">
          (+{(result.currentDailyRate * 100).toFixed(2)}%)
        </span>
      </h2>
      <h3 className="text-center">
        <span className="text-neutral-400">Today:</span>{" "}
        <Currency
          prefix={"+"}
          value={result.todaysProfit}
          className="font-bold text-green-500"
        />
      </h3>
      <p className="text-center">
        <span className="text-green-500">Balance:</span>{" "}
        <Currency value={result.totalBalance} className="font-bold" />
      </p>
    </div>

    <div className="grid grid-cols-3 gap-1">
      <MetricCard
        title="Invested"
        value={result.totalInvested}
        valueColor="text-green-500"
      />
      <MetricCard
        title="Profits"
        value={result.totalProfits}
        valueColor="text-green-500"
      />
      <MetricCard
        title="Withdrawn"
        value={result.totalWithdrawn}
        valueColor="text-red-500"
      />
    </div>
  </>
);

export default function DayView({ selectedDate, onSelectDate }) {
  const investments = useAppStore((state) => state.investments);
  const withdrawals = useAppStore((state) => state.withdrawals);
  const addInvestment = useAppStore((state) => state.addInvestment);
  const addWithdrawal = useAppStore((state) => state.addWithdrawal);
  const removeInvestment = useAppStore((state) => state.removeInvestment);
  const removeWithdrawal = useAppStore((state) => state.removeWithdrawal);

  const result = useMemo(() => {
    return InvestmentEngine.calculateTp(selectedDate, investments, withdrawals);
  }, [selectedDate, investments, withdrawals]);

  const todayTransactions = useMemo(() => {
    return [
      {
        type: "earnings",
        amount: result.todaysProfit,
        date: selectedDate,
      },
      ...withdrawals
        .filter(
          (withdrawal) =>
            new Date(withdrawal.date).toDateString() ===
            selectedDate.toDateString()
        )
        .map((withdrawal) => ({ ...withdrawal, type: "withdrawal" })),
      ...investments
        .filter(
          (investment) =>
            new Date(investment.date).toDateString() ===
            selectedDate.toDateString()
        )
        .map((investment) => ({
          ...investment,
          type: "investment",
        })),
    ];
  }, [selectedDate, investments, withdrawals, result.todaysProfit]);

  const endDate = useMemo(() => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + InvestmentEngine.INVESTMENT_DURATION);
    return date;
  }, [selectedDate]);

  const [investmentAmount, setInvestmentAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState(
    result.totalBalance.toFixed(4)
  );

  const reinvest = (amount) => {
    addWithdrawal({
      id: crypto.randomUUID(),
      date: selectedDate,
      amount: parseFloat(amount),
    });
    addInvestment({
      id: crypto.randomUUID(),
      date: selectedDate,
      amount: parseFloat(amount),
    });
  };

  const handleInvest = () => {
    if (parseFloat(investmentAmount) >= 1) {
      addInvestment({
        id: crypto.randomUUID(),
        date: selectedDate,
        amount: parseFloat(investmentAmount),
      });
      setInvestmentAmount("");
    }
  };

  const handleWithdraw = () => {
    if (withdrawalAmount) {
      addWithdrawal({
        id: crypto.randomUUID(),
        date: selectedDate,
        amount: parseFloat(withdrawalAmount),
      });
      setWithdrawalAmount("");
    }
  };

  const handleReInvest = () => {
    if (withdrawalAmount) {
      reinvest(withdrawalAmount);
      setWithdrawalAmount("");
    }
  };

  const handleMaxWithdrawal = () => {
    setWithdrawalAmount(result.totalBalance.toFixed(4));
  };

  return (
    <PageContainer className="flex flex-col gap-4 px-2 py-4">
      <MetricsDisplay result={result} />

      {result.totalBalance >= 1 && (
        <div className="flex flex-col items-start gap-2 p-4 bg-neutral-800 rounded-xl">
          <p>
            You have an available balance of{" "}
            <Currency
              className="text-green-500 font-bold"
              value={result.totalBalance}
            />
          </p>
          <button
            className={cn(
              "bg-pink-500 hover:bg-pink-600",
              "px-4 py-2 rounded-xl text-sm font-bold cursor-pointer",
              "flex items-center gap-2"
            )}
            onClick={() => reinvest(result.totalBalance)}
          >
            <LuRefreshCw className="size-4" />
            Quick Reinvest
          </button>
        </div>
      )}

      <Tabs.Root defaultValue="invest" className="flex flex-col gap-2">
        <Tabs.List className="grid grid-cols-3 gap-1">
          <TabTriggerButton value="invest">Invest</TabTriggerButton>
          <TabTriggerButton value="withdraw">Withdraw</TabTriggerButton>
          <TabTriggerButton value="simulate">Simulate</TabTriggerButton>
        </Tabs.List>

        <Tabs.Content value="invest" className="flex flex-col gap-2">
          <InputSection>
            <CurrencyInput
              value={investmentAmount}
              onChange={setInvestmentAmount}
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

        <Tabs.Content value="withdraw" className="flex flex-col gap-2">
          <InputSection>
            <CurrencyInput
              value={withdrawalAmount}
              onChange={setWithdrawalAmount}
            />
            <ActionButton onClick={handleMaxWithdrawal}>
              <LuMaximize2 className="size-4" />
              Max
            </ActionButton>
          </InputSection>

          <ButtonGroup>
            <ActionButton onClick={handleWithdraw}>
              <LuMinus className="size-4" />
              Withdraw
            </ActionButton>
            <ActionButton onClick={handleReInvest} variant="secondary">
              <LuRefreshCw className="size-4" />
              Re-Invest
            </ActionButton>
          </ButtonGroup>
        </Tabs.Content>

        <Tabs.Content value="simulate" className="flex flex-col gap-2">
          <Simulation selectedDate={selectedDate} onSelectDate={onSelectDate} />
        </Tabs.Content>
      </Tabs.Root>

      <TransactionsList
        title="Today's transactions"
        transactions={todayTransactions}
        onRemoveInvestment={removeInvestment}
        onRemoveWithdrawal={removeWithdrawal}
      />

      <ActiveInvestments
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        investments={result.currentActiveInvestments}
      />
    </PageContainer>
  );
}
