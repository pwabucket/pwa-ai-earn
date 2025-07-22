import { LuX } from "react-icons/lu";
import { Tabs } from "radix-ui";
import { useMemo } from "react";
import { useState } from "react";

import Input from "./Input";
import InvestmentEngine from "../lib/InvestmentEngine";
import useAppStore from "../store/useAppStore";
import { cn } from "../lib/utils";

const formatCurrency = (amount) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const TabTriggerButton = (props) => (
  <Tabs.Trigger
    {...props}
    className={cn(
      "px-4 py-2 bg-neutral-800 rounded-xl",
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
    <p className={cn("font-bold", valueColor)}>{formatCurrency(value)}</p>
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
        {type === "investment" ? "Investment" : "Withdraw"}
      </div>
      <div
        className={type === "investment" ? "text-green-500" : "text-red-500"}
      >
        {type === "investment" ? "+" : "-"}${amount}
      </div>
    </div>
    <button
      onClick={onRemove}
      className={cn(
        "p-2 rounded-xl bg-neutral-700 hover:bg-neutral-600",
        "transition-colors cursor-pointer"
      )}
    >
      <LuX className="size-5" />
    </button>
  </div>
);

const TransactionsList = ({ title, transactions, type, onRemove }) => (
  <div className="flex flex-col gap-2 p-4 rounded-xl bg-neutral-800">
    <h1 className="font-bold">{title}</h1>
    {transactions.length > 0 ? (
      transactions.map((transaction, index) => (
        <TransactionItem
          key={index}
          amount={transaction.amount}
          type={type}
          onRemove={() => onRemove(transaction.id)}
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
        {formatCurrency(result.activeInvestments)}
      </h1>
      <h2 className="text-center font-bold">
        <span className="text-neutral-400">Daily Earn:</span>{" "}
        {formatCurrency(result.currentDailyProfit)}{" "}
        <span className="text-green-500">
          (+{(result.currentDailyRate * 100).toFixed(2)}%)
        </span>
      </h2>
      <p className="text-center">
        <span className="text-green-500">Balance:</span>{" "}
        {formatCurrency(result.totalBalance)}
      </p>
    </div>

    <div className="grid grid-cols-3 gap-2 px-2">
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

export default function DayView({ selectedDate }) {
  const investments = useAppStore((state) => state.investments);
  const withdrawals = useAppStore((state) => state.withdrawals);
  const addInvestment = useAppStore((state) => state.addInvestment);
  const addWithdrawal = useAppStore((state) => state.addWithdrawal);
  const removeInvestment = useAppStore((state) => state.removeInvestment);
  const removeWithdrawal = useAppStore((state) => state.removeWithdrawal);

  const todayInvestments = useMemo(() => {
    return investments.filter((investment) => investment.date === selectedDate);
  }, [selectedDate, investments]);

  const todayWithdrawals = useMemo(() => {
    return withdrawals.filter((withdrawal) => withdrawal.date === selectedDate);
  }, [selectedDate, withdrawals]);

  const result = useMemo(() => {
    return InvestmentEngine.calculateTp(selectedDate, investments, withdrawals);
  }, [selectedDate, investments, withdrawals]);

  const [investmentAmount, setInvestmentAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState(
    result.totalBalance.toFixed(4)
  );

  const handleInvest = () => {
    if (investmentAmount) {
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
      addWithdrawal({
        id: crypto.randomUUID(),
        date: selectedDate,
        amount: parseFloat(withdrawalAmount),
      });
      addInvestment({
        id: crypto.randomUUID(),
        date: selectedDate,
        amount: parseFloat(withdrawalAmount),
      });
      setWithdrawalAmount("");
    }
  };

  const handleMaxWithdrawal = () => {
    setWithdrawalAmount(result.totalBalance.toFixed(4));
  };

  return (
    <>
      <MetricsDisplay result={result} />

      <Tabs.Root
        defaultValue="investments"
        className="px-2 flex flex-col gap-2"
      >
        <Tabs.List className="grid grid-cols-2 gap-2">
          <TabTriggerButton value="investments">Investments</TabTriggerButton>
          <TabTriggerButton value="withdrawals">Withdrawals</TabTriggerButton>
        </Tabs.List>

        <Tabs.Content value="investments" className="flex flex-col gap-2">
          <InputSection>
            <CurrencyInput
              value={investmentAmount}
              onChange={setInvestmentAmount}
            />
            <ActionButton onClick={handleInvest}>Invest</ActionButton>
          </InputSection>

          <TransactionsList
            title="Today's investments"
            transactions={todayInvestments}
            type="investment"
            onRemove={removeInvestment}
          />
        </Tabs.Content>

        <Tabs.Content value="withdrawals" className="flex flex-col gap-2">
          <InputSection>
            <CurrencyInput
              value={withdrawalAmount}
              onChange={setWithdrawalAmount}
            />
            <ActionButton onClick={handleMaxWithdrawal}>Max</ActionButton>
          </InputSection>

          <ButtonGroup>
            <ActionButton onClick={handleWithdraw}>Withdraw</ActionButton>
            <ActionButton onClick={handleReInvest} variant="secondary">
              Re-Invest
            </ActionButton>
          </ButtonGroup>

          <TransactionsList
            title="Today's withdrawals"
            transactions={todayWithdrawals}
            type="withdrawal"
            onRemove={removeWithdrawal}
          />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
