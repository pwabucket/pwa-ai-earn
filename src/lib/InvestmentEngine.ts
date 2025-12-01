import { differenceInDays } from "date-fns";
import type { Transaction } from "../types/app";
import { startOfDay } from "../utils/dateUtils";
import Decimal from "decimal.js";

export default class InvestmentEngine {
  static INVESTMENT_DURATION = 20 as const;
  static MINIMUM_INVESTMENT_AMOUNT = 1 as const;

  /**
   * Gets daily percentage rate based on investment amount
   * @param amount - Total investment amount
   * @returns Daily percentage rate as decimal
   */
  static getPercentage(amount: Decimal.Value) {
    if (new Decimal(amount).greaterThanOrEqualTo(300)) {
      return new Decimal(6.5).dividedBy(100);
    } else if (new Decimal(amount).greaterThanOrEqualTo(20)) {
      return new Decimal(6).dividedBy(100);
    } else {
      return new Decimal(5.5).dividedBy(100);
    }
  }

  /**
   * Get date key for a given date
   * @param date - Date to convert
   * @returns Date key
   */
  static getDateKey(date: Date): number {
    return date.getTime();
  }

  /**
   * Calculates days between two dates
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Number of days between dates
   */
  static getDaysDifference(startDate: Date, endDate: Date): number {
    const start = startOfDay(startDate);
    const end = startOfDay(endDate);
    return differenceInDays(end, start);
  }

  /**
   * Checks if an investment is active on a given date
   * @param investment - Investment object with date and amount
   * @param currentDate - Date to check
   * @param profitOnly - If true, only returns investments generating profits (day 1+)
   * @returns True if investment is active
   */
  static isInvestmentActive(
    investment: Transaction,
    currentDate: Date,
    profitOnly = false
  ) {
    const investmentStart = startOfDay(investment.date);
    const daysSinceStart = this.getDaysDifference(investmentStart, currentDate);

    return (
      daysSinceStart >= (profitOnly ? 1 : 0) &&
      daysSinceStart <= this.INVESTMENT_DURATION
    );
  }

  /**
   * Gets all active investments for a specific date
   * @param transactions - Array of transaction objects
   * @param currentDate - Date to check
   * @param profitOnly - If true, only returns profit-generating investments
   * @returns Array of active investments
   */
  static getActiveInvestments(
    transactions: Transaction[],
    currentDate: Date,
    profitOnly = false
  ) {
    return transactions
      .filter((t) => t.type === "investment" || t.type === "exchange")
      .filter((investment) =>
        this.isInvestmentActive(investment, currentDate, profitOnly)
      );
  }

  /**
   * Groups investments and withdrawals by date
   * @param investments - Array of investment objects
   * @param withdrawals - Array of withdrawal objects
   * @returns Array of date groups sorted chronologically
   */
  static groupEventsByDate(
    investments: Transaction[],
    withdrawals: Transaction[]
  ) {
    const eventGroups = new Map<
      number,
      { date: Date; investments: Transaction[]; withdrawals: Transaction[] }
    >();

    investments.forEach((investment) => {
      const dateKey = this.getDateKey(startOfDay(investment.date));
      if (!eventGroups.has(dateKey)) {
        eventGroups.set(dateKey, {
          date: startOfDay(investment.date),
          investments: [],
          withdrawals: [],
        });
      }
      eventGroups.get(dateKey)?.investments.push(investment);
    });

    withdrawals.forEach((withdrawal) => {
      const dateKey = this.getDateKey(startOfDay(withdrawal.date));
      if (!eventGroups.has(dateKey)) {
        eventGroups.set(dateKey, {
          date: startOfDay(withdrawal.date),
          investments: [],
          withdrawals: [],
        });
      }
      eventGroups.get(dateKey)?.withdrawals.push(withdrawal);
    });

    return Array.from(eventGroups.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }

  /**
   * Sums the amounts of an array of transaction objects.
   * @param transactions - Array of transaction objects
   * @returns Total sum of transaction amounts
   */
  static sumTransactions(transactions: Transaction[]) {
    return transactions.reduce(
      (sum, transaction) => sum.plus(new Decimal(transaction.amount)),
      new Decimal(0)
    );
  }

  /**
   * Calculates the profit for a given amount and rate.
   * @param amount - The investment amount.
   * @param rate - The profit rate.
   * @returns The calculated profit.
   */
  static calculateProfit(amount: Decimal.Value, rate: Decimal.Value) {
    return this.floatAmount(new Decimal(amount).times(new Decimal(rate)));
  }

  static filterTransactions(transactions: Transaction[]) {
    return {
      investments: transactions.filter((t) => t.type === "investment"),
      withdrawals: transactions.filter((t) => t.type === "withdrawal"),
      exchanges: transactions.filter((t) => t.type === "exchange"),
    };
  }

  static getDayMap(transactions: Transaction[]) {
    const results = new Map<number, Decimal>();
    transactions.forEach((t) => {
      const dateKey = this.getDateKey(startOfDay(t.date));
      if (!results.has(dateKey)) {
        results.set(dateKey, new Decimal(0));
      }
      results.set(dateKey, results.get(dateKey)!.plus(new Decimal(t.amount)));
    });
    return results;
  }

  /**
   * Calculates total portfolio metrics for a given date
   * @param selectedDate - Date to calculate metrics for
   * @param transactions - Array of transaction objects
   * @returns Portfolio metrics including balance, profits, and active investments
   */
  static calculateTp(selectedDate: Date, transactions: Transaction[]) {
    const normalizedSelectedDate = startOfDay(selectedDate);
    const priorTransactions = transactions.filter(
      (tx) => startOfDay(tx.date) <= normalizedSelectedDate
    );

    const { investments, withdrawals, exchanges } =
      this.filterTransactions(priorTransactions);

    const priorInvestments = investments;
    const priorWithdrawals = withdrawals;
    const priorExchanges = exchanges;

    if (priorInvestments.length === 0) {
      return {
        totalBalance: new Decimal(0),
        totalProfits: new Decimal(0),
        totalInvested: new Decimal(0),
        totalKept: new Decimal(0),
        totalWithdrawn: new Decimal(0),
        activeInvestments: new Decimal(0),
        currentDailyProfit: new Decimal(0),
        currentDailyRate: new Decimal(0),
        todaysProfit: new Decimal(0),
        currentActiveInvestments: [],
      };
    }

    const earliestDate = startOfDay(
      Math.min(...priorTransactions.map((tx) => startOfDay(tx.date).getTime()))
    );
    const endDate = startOfDay(normalizedSelectedDate);

    let availableBalance = new Decimal(0);
    let totalProfits = new Decimal(0);
    let totalKept = new Decimal(0);
    const totalInvested = this.sumTransactions(priorInvestments);
    const totalWithdrawn = this.sumTransactions(priorWithdrawals);
    const totalExchanged = this.sumTransactions(priorExchanges);

    const investmentsByDate = this.getDayMap(priorInvestments);
    const withdrawalsByDate = this.getDayMap(priorWithdrawals);
    const exchangesByDate = this.getDayMap(priorExchanges);

    const currentDate = startOfDay(earliestDate);
    while (currentDate <= endDate) {
      const currentDateKey = this.getDateKey(currentDate);

      const profitGeneratingInvestments = this.getActiveInvestments(
        priorTransactions,
        currentDate,
        true
      );

      const totalActiveAmount = this.sumTransactions(
        profitGeneratingInvestments
      );

      let dailyProfit = new Decimal(0);
      if (totalActiveAmount.greaterThan(0)) {
        const dailyRate = this.getPercentage(totalActiveAmount);
        dailyProfit = this.calculateProfit(totalActiveAmount, dailyRate);
        totalProfits = totalProfits.plus(dailyProfit);
        availableBalance = availableBalance.plus(dailyProfit);
      }

      const todayInvestments =
        investmentsByDate.get(currentDateKey) || new Decimal(0);
      const todayWithdrawals =
        withdrawalsByDate.get(currentDateKey) || new Decimal(0);
      const todayExchanges =
        exchangesByDate.get(currentDateKey) || new Decimal(0);

      totalKept = totalKept.plus(
        Decimal.max(new Decimal(0), todayWithdrawals.minus(todayInvestments))
      );

      availableBalance = availableBalance.minus(todayExchanges);
      availableBalance = availableBalance.minus(todayWithdrawals);

      if (availableBalance.lessThan(0)) {
        availableBalance = new Decimal(0);
      }

      currentDate.setDate(currentDate.getDate() + 1);
      startOfDay(currentDate);
    }

    const currentActiveInvestments = this.getActiveInvestments(
      priorTransactions,
      endDate,
      false
    );
    const totalActiveAmount = this.sumTransactions(currentActiveInvestments);

    const currentDailyRate = totalActiveAmount.greaterThan(0)
      ? this.getPercentage(totalActiveAmount)
      : new Decimal(0);
    const currentDailyProfit = this.calculateProfit(
      totalActiveAmount,
      currentDailyRate
    );

    const todaysProfitGeneratingInvestments = this.getActiveInvestments(
      priorTransactions,
      endDate,
      true
    );
    const todaysProfitAmount = this.sumTransactions(
      todaysProfitGeneratingInvestments
    );
    const todaysProfitRate = todaysProfitAmount.greaterThan(0)
      ? this.getPercentage(todaysProfitAmount)
      : 0;
    const todaysProfit = this.calculateProfit(
      todaysProfitAmount,
      todaysProfitRate
    );

    return {
      totalBalance: availableBalance,
      totalProfits,
      totalInvested,
      totalWithdrawn,
      totalExchanged,
      activeInvestments: totalActiveAmount,
      currentDailyProfit,
      currentDailyRate,
      todaysProfit,
      totalKept,
      currentActiveInvestments,
    };
  }

  /**
   * Calculate the state of transactions after all investments have expired.
   * @param targetDate - The date to calculate the state for.
   * @param transactions - The transactions
   * @param onlyTarget - Should limit to the target date
   * @returns Object containing the expiration date and the result of the calculation
   */
  static calculateExpiredState(
    targetDate: Date,
    transactions: Transaction[],
    onlyTarget = false
  ) {
    const investments = transactions.filter(
      (t) => t.type === "investment" || t.type === "exchange"
    );

    const latestInvestmentDate = onlyTarget
      ? startOfDay(targetDate)
      : startOfDay(
          investments.length > 0
            ? Math.max(
                ...investments.map((inv) => startOfDay(inv.date).getTime())
              )
            : targetDate
        );

    const allInvestmentsExpireDate = startOfDay(latestInvestmentDate);
    allInvestmentsExpireDate.setDate(
      allInvestmentsExpireDate.getDate() + this.INVESTMENT_DURATION
    );

    return {
      date: allInvestmentsExpireDate,
      result: this.calculateTp(allInvestmentsExpireDate, transactions),
    };
  }

  /**
   * Calculate the current state of transactions.
   * @param selectedDate - The date for which to calculate the state.
   * @param transactions - The list of transaction objects.
   * @returns The calculated state of transactions.
   */
  static calculateInvestments(selectedDate: Date, transactions: Transaction[]) {
    const currentState = this.calculateTp(selectedDate, transactions);

    const { date: allInvestmentsExpireDate, result: expiredState } =
      this.calculateExpiredState(selectedDate, transactions);

    const {
      date: selectedInvestmentsExpireDate,
      result: selectedExpiredState,
    } = this.calculateExpiredState(selectedDate, transactions, true);

    return {
      currentState,
      expiredState,
      allInvestmentsExpireDate,
      selectedInvestmentsExpireDate,
      selectedExpiredState,
    };
  }

  /**
   * Floats a number to fixed decimal places.
   * @param amount - The amount to float
   * @returns The floated amount
   */
  static floatAmount(amount: Decimal.Value) {
    return new Decimal(amount).toDecimalPlaces(4);
  }

  /**
   * Simulates daily compounding by withdrawing daily balance and reinvesting it
   * @param selectedDate - Starting date for simulation
   * @param targetDate - End date for simulation
   * @param transactions - Array of existing transaction objects
   * @returns Simulation results with timeline and final metrics
   */
  static simulateInvestments(
    selectedDate: Date,
    targetDate: Date,
    transactions: Transaction[]
  ) {
    const simulatedTransactions: Transaction[] = [...transactions];
    const initialState = this.calculateTp(selectedDate, simulatedTransactions);
    const timeline = [];

    let dayIndex = 0;
    let availableBalance = initialState.totalBalance;
    let totalInvested = initialState.totalInvested;

    const simulationDays = this.getDaysDifference(
      startOfDay(selectedDate),
      startOfDay(targetDate)
    );

    const createInvestment = (date: Date, amount: Decimal.Value) => {
      simulatedTransactions.push({
        id: `sim_exchange_${date.getTime()}`,
        date: startOfDay(date),
        amount,
        isSimulated: true,
        type: "exchange",
      });
      totalInvested = totalInvested.plus(new Decimal(amount));
      availableBalance = new Decimal(0);
    };

    /* Initial Investment on selected date */
    if (availableBalance.greaterThanOrEqualTo(this.MINIMUM_INVESTMENT_AMOUNT)) {
      createInvestment(selectedDate, availableBalance);

      const currentActiveInvestments = this.getActiveInvestments(
        simulatedTransactions,
        selectedDate,
        false
      );
      const activeInvestments = this.sumTransactions(currentActiveInvestments);

      timeline.push({
        index: dayIndex,
        date: startOfDay(selectedDate),
        compound: true,
        profitDayIndex: 0,
        balanceExchanged: availableBalance,
        totalInvested,
        activeInvestments,
        availableBalance,
        currentDailyProfit: initialState.currentDailyProfit,
      });
    }

    const currentDate = startOfDay(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    startOfDay(currentDate);

    while (currentDate <= startOfDay(targetDate)) {
      const profitGeneratingInvestments = this.getActiveInvestments(
        simulatedTransactions,
        currentDate,
        true
      );

      const totalActiveAmount = this.sumTransactions(
        profitGeneratingInvestments
      );

      let dailyProfit = new Decimal(0);
      let balanceExchanged = new Decimal(0);

      if (totalActiveAmount.greaterThan(0)) {
        const dailyRate = this.getPercentage(totalActiveAmount);
        dailyProfit = this.calculateProfit(totalActiveAmount, dailyRate);
        availableBalance = availableBalance.plus(dailyProfit);
      }

      if (
        availableBalance.greaterThanOrEqualTo(this.MINIMUM_INVESTMENT_AMOUNT)
      ) {
        balanceExchanged = availableBalance;
        createInvestment(currentDate, balanceExchanged);
      }

      const currentActiveInvestments = this.getActiveInvestments(
        simulatedTransactions,
        currentDate,
        false
      );
      const activeInvestments = this.sumTransactions(currentActiveInvestments);

      timeline.push({
        index: ++dayIndex,
        date: startOfDay(currentDate),
        compound: true,
        profitDayIndex: 0,
        balanceExchanged,
        totalInvested,
        activeInvestments,
        availableBalance,
        currentDailyProfit: dailyProfit,
      });

      currentDate.setDate(currentDate.getDate() + 1);
      startOfDay(currentDate);
    }

    let profitDayIndex = 0;

    while (true) {
      const profitGeneratingInvestments = this.getActiveInvestments(
        simulatedTransactions,
        currentDate,
        true
      );

      if (profitGeneratingInvestments.length === 0) {
        break;
      }

      const totalActiveAmount = this.sumTransactions(
        profitGeneratingInvestments
      );

      let dailyProfit = new Decimal(0);

      if (totalActiveAmount.greaterThan(0)) {
        const dailyRate = this.getPercentage(totalActiveAmount);
        dailyProfit = this.calculateProfit(totalActiveAmount, dailyRate);
        availableBalance = availableBalance.plus(dailyProfit);
      }

      timeline.push({
        index: ++dayIndex,
        date: startOfDay(currentDate),
        compound: false,
        profitDayIndex: ++profitDayIndex,
        availableBalance,
        totalInvested,
        activeInvestments: totalActiveAmount,
        balanceExchanged: new Decimal(0),
        currentDailyProfit: dailyProfit,
      });

      currentDate.setDate(currentDate.getDate() + 1);
      startOfDay(currentDate);
    }

    const finalState = this.calculateTp(targetDate, simulatedTransactions);

    const { date: allInvestmentsExpireDate, result: expiredState } =
      this.calculateExpiredState(targetDate, simulatedTransactions);

    return {
      initialState,
      finalState,
      timeline,
      simulationDays,
      simulatedTransactions,
      totalGrowth: finalState.totalInvested.minus(initialState.totalInvested),
      allInvestmentsExpireDate,
      expiredState,
      totalWithdrawableAfterExpiry: expiredState.totalBalance,
      finalTotalProfits: expiredState.totalProfits,
      totalReturn: expiredState.totalBalance.plus(expiredState.totalWithdrawn),
    };
  }
}
