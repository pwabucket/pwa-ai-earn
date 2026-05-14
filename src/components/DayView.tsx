import { Tabs } from "radix-ui";
import { useCallback, useState } from "react";

import PageContainer from "./PageContainer";
import useAppStore from "../store/useAppStore";
import { ActiveInvestments } from "./ActiveInvestments";
import { DayViewQuickReinvestCard } from "./DayViewQuickReinvestCard";
import { DayViewTransactionsList } from "./DayViewTransactionsList";
import { InvestTab } from "./DayViewInvestTab";
import { MetricsDisplay } from "./DayViewMetrics";
import { SimulateTab } from "./DayViewSimulateTab";
import { TabTriggerButton } from "./TabTriggerButton";
import { WithdrawTab } from "./DayViewWithdrawTab";
import { Decimal } from "decimal.js";
import { useInvestmentCalculations } from "../hooks/useInvestmentCalculations";
import { useInvestmentEndDate } from "../hooks/useInvestmentEndDate";
import { useTodayTransactions } from "../hooks/useTodayTransactions";
import useActiveAccount from "../hooks/useActiveAccount";
import type { Transaction } from "../types/app";

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
