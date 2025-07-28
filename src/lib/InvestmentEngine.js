import { startOfDay } from "../utils/dateUtils";

export default class InvestmentEngine {
  static INVESTMENT_DURATION = 20;

  /**
   * Gets daily percentage rate based on investment amount
   * @param {number} amount - Total investment amount
   * @returns {number} Daily percentage rate as decimal
   */
  static getPercentage(amount) {
    if (amount >= 300) {
      return 6.5 / 100;
    } else if (amount >= 20) {
      return 6 / 100;
    } else {
      return 5.5 / 100;
    }
  }

  /**
   * Get date key for a given date
   * @param {Date} date - Date to convert
   * @returns {int} Date key
   */
  static getDateKey(date) {
    return date.getTime();
  }

  /**
   * Calculates days between two dates
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {number} Number of days between dates
   */
  static getDaysDifference(startDate, endDate) {
    const start = startOfDay(startDate);
    const end = startOfDay(endDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Checks if an investment is active on a given date
   * @param {Object} investment - Investment object with date and amount
   * @param {Date} currentDate - Date to check
   * @param {boolean} profitOnly - If true, only returns investments generating profits (day 1+)
   * @returns {boolean} True if investment is active
   */
  static isInvestmentActive(investment, currentDate, profitOnly = false) {
    const investmentStart = startOfDay(investment.date);
    const daysSinceStart = this.getDaysDifference(investmentStart, currentDate);

    if (profitOnly) {
      return daysSinceStart >= 1 && daysSinceStart <= this.INVESTMENT_DURATION;
    } else {
      return daysSinceStart >= 0 && daysSinceStart <= this.INVESTMENT_DURATION;
    }
  }

  /**
   * Gets all active investments for a specific date
   * @param {Array} investments - Array of investment objects
   * @param {Date} currentDate - Date to check
   * @param {boolean} profitOnly - If true, only returns profit-generating investments
   * @returns {Array} Array of active investments
   */
  static getActiveInvestments(investments, currentDate, profitOnly = false) {
    return investments.filter((investment) =>
      this.isInvestmentActive(investment, currentDate, profitOnly)
    );
  }

  /**
   * Groups investments and withdrawals by date
   * @param {Array} investments - Array of investment objects
   * @param {Array} withdrawals - Array of withdrawal objects
   * @returns {Array} Array of date groups sorted chronologically
   */
  static groupEventsByDate(investments, withdrawals) {
    const eventGroups = new Map();

    investments.forEach((investment) => {
      const dateKey = this.getDateKey(startOfDay(investment.date));
      if (!eventGroups.has(dateKey)) {
        eventGroups.set(dateKey, {
          date: startOfDay(investment.date),
          investments: [],
          withdrawals: [],
        });
      }
      eventGroups.get(dateKey).investments.push(investment);
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
      eventGroups.get(dateKey).withdrawals.push(withdrawal);
    });

    return Array.from(eventGroups.values()).sort((a, b) => a.date - b.date);
  }

  /**
   * Sums the amounts of an array of transaction objects.
   * @param {Array} transactions - Array of transaction objects
   * @returns {number} Total sum of transaction amounts
   */
  static sumTransactions(transactions) {
    return transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
  }

  /**
   * Calculates the profit for a given amount and rate.
   * @param {number} amount - The investment amount.
   * @param {number} rate - The profit rate.
   * @returns {number} The calculated profit.
   */
  static calculateProfit(amount, rate) {
    return amount * rate;
  }

  /**
   * Calculates total portfolio metrics for a given date
   * @param {Date} selectedDate - Date to calculate metrics for
   * @param {Array} investments - Array of investment objects
   * @param {Array} withdrawals - Array of withdrawal objects
   * @returns {Object} Portfolio metrics including balance, profits, and active investments
   */
  static calculateTp(selectedDate, investments, withdrawals) {
    const normalizedSelectedDate = startOfDay(selectedDate);
    const priorInvestments = investments.filter(
      (investment) => startOfDay(investment.date) <= normalizedSelectedDate
    );

    const priorWithdrawals = withdrawals.filter(
      (withdrawal) => startOfDay(withdrawal.date) <= normalizedSelectedDate
    );

    if (priorInvestments.length === 0) {
      return {
        totalBalance: 0,
        totalProfits: 0,
        totalInvested: 0,
        totalKept: 0,
        totalWithdrawn: 0,
        activeInvestments: 0,
        currentDailyProfit: 0,
        currentDailyRate: 0,
        todaysProfit: 0,
        currentActiveInvestments: [],
      };
    }

    const earliestDate = startOfDay(
      Math.min(...priorInvestments.map((inv) => startOfDay(inv.date)))
    );
    const endDate = startOfDay(normalizedSelectedDate);

    let availableBalance = 0;
    let totalProfits = 0;
    let totalKept = 0;
    let totalInvested = this.sumTransactions(priorInvestments);
    let totalWithdrawn = this.sumTransactions(priorWithdrawals);

    const investmentsByDate = new Map();
    priorInvestments.forEach((investment) => {
      const dateKey = this.getDateKey(startOfDay(investment.date));
      if (!investmentsByDate.has(dateKey)) {
        investmentsByDate.set(dateKey, 0);
      }
      investmentsByDate.set(
        dateKey,
        investmentsByDate.get(dateKey) + investment.amount
      );
    });

    const withdrawalsByDate = new Map();
    priorWithdrawals.forEach((withdrawal) => {
      const dateKey = this.getDateKey(startOfDay(withdrawal.date));
      if (!withdrawalsByDate.has(dateKey)) {
        withdrawalsByDate.set(dateKey, 0);
      }
      withdrawalsByDate.set(
        dateKey,
        withdrawalsByDate.get(dateKey) + withdrawal.amount
      );
    });

    const currentDate = startOfDay(earliestDate);
    while (currentDate <= endDate) {
      const currentDateString = this.getDateKey(currentDate);

      const profitGeneratingInvestments = this.getActiveInvestments(
        priorInvestments,
        currentDate,
        true
      );

      const totalActiveAmount = this.sumTransactions(
        profitGeneratingInvestments
      );

      let dailyProfit = 0;
      if (totalActiveAmount > 0) {
        const dailyRate = this.getPercentage(totalActiveAmount);
        dailyProfit = this.calculateProfit(totalActiveAmount, dailyRate);
        totalProfits += dailyProfit;
        availableBalance += dailyProfit;
      }

      const todayInvestments = investmentsByDate.get(currentDateString) || 0;
      const todayWithdrawals = withdrawalsByDate.get(currentDateString) || 0;

      totalKept += Math.max(0, todayWithdrawals - todayInvestments);

      if (todayWithdrawals > 0) {
        availableBalance -= todayWithdrawals;
        if (availableBalance < 0) {
          availableBalance = 0;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
      startOfDay(currentDate);
    }

    const currentActiveInvestments = this.getActiveInvestments(
      priorInvestments,
      endDate,
      false
    );
    const totalActiveAmount = this.sumTransactions(currentActiveInvestments);

    const currentDailyRate =
      totalActiveAmount > 0 ? this.getPercentage(totalActiveAmount) : 0;
    const currentDailyProfit = this.calculateProfit(
      totalActiveAmount,
      currentDailyRate
    );

    const todaysProfitGeneratingInvestments = this.getActiveInvestments(
      priorInvestments,
      endDate,
      true
    );
    const todaysProfitAmount = this.sumTransactions(
      todaysProfitGeneratingInvestments
    );
    const todaysProfitRate =
      todaysProfitAmount > 0 ? this.getPercentage(todaysProfitAmount) : 0;
    const todaysProfit = this.calculateProfit(
      todaysProfitAmount,
      todaysProfitRate
    );

    return {
      totalBalance: availableBalance,
      totalProfits,
      totalInvested,
      totalWithdrawn,
      activeInvestments: totalActiveAmount,
      currentDailyProfit,
      currentDailyRate,
      todaysProfit,
      totalKept,
      currentActiveInvestments,
    };
  }

  /**
   * Calculate the state of investments and withdrawals after all investments have expired.
   * @param {Date} targetDate - The date to calculate the state for.
   * @param {array} investments
   * @param {array} withdrawals
   * @returns {Object} Object containing the expiration date and the result of the calculation
   */
  static calculateExpiredState(targetDate, investments, withdrawals) {
    const latestInvestmentDate = startOfDay(
      investments.length > 0
        ? Math.max(...investments.map((inv) => startOfDay(inv.date)))
        : targetDate
    );

    const allInvestmentsExpireDate = startOfDay(latestInvestmentDate);
    allInvestmentsExpireDate.setDate(
      allInvestmentsExpireDate.getDate() + this.INVESTMENT_DURATION
    );

    return {
      date: allInvestmentsExpireDate,
      result: this.calculateTp(
        allInvestmentsExpireDate,
        investments,
        withdrawals
      ),
    };
  }

  /**
   * Calculate the current state of investments and withdrawals.
   * @param {Date} selectedDate - The date for which to calculate the state.
   * @param {Array} investments - The list of investment objects.
   * @param {Array} withdrawals - The list of withdrawal objects.
   * @returns {Object} The calculated state of investments and withdrawals.
   */
  static calculateInvestments(selectedDate, investments, withdrawals) {
    const currentState = this.calculateTp(
      selectedDate,
      investments,
      withdrawals
    );

    const { date: allInvestmentsExpireDate, result: expiredState } =
      this.calculateExpiredState(selectedDate, investments, withdrawals);

    return {
      currentState,
      expiredState,
      allInvestmentsExpireDate,
    };
  }

  /**
   * Simulates daily compounding by withdrawing daily balance and reinvesting it
   * @param {Date} selectedDate - Starting date for simulation
   * @param {Date} targetDate - End date for simulation
   * @param {Array} investments - Array of existing investment objects
   * @param {Array} withdrawals - Array of existing withdrawal objects
   * @returns {Object} Simulation results with timeline and final metrics
   */
  static simulateInvestments(
    selectedDate,
    targetDate,
    investments,
    withdrawals
  ) {
    const initialState = this.calculateTp(
      selectedDate,
      investments,
      withdrawals
    );

    const simulatedInvestments = [...investments];
    const simulatedWithdrawals = [...withdrawals];
    const timeline = [];

    const createInvestment = (date, amount) => {
      simulatedWithdrawals.push({
        id: `sim_withdrawal_${date.getTime()}`,
        date: startOfDay(date),
        amount,
        isSimulated: true,
      });
      simulatedInvestments.push({
        id: `sim_investment_${date.getTime()}`,
        date: startOfDay(date),
        amount,
        isSimulated: true,
      });

      totalInvested += amount;
      availableBalance = 0;
    };

    let availableBalance = initialState.totalBalance;
    let totalInvested = initialState.totalInvested;

    if (availableBalance >= 1) {
      createInvestment(selectedDate, availableBalance);
    }

    const currentDate = startOfDay(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    startOfDay(currentDate);

    while (currentDate <= startOfDay(targetDate)) {
      const profitGeneratingInvestments = this.getActiveInvestments(
        simulatedInvestments,
        currentDate,
        true
      );

      const totalActiveAmount = this.sumTransactions(
        profitGeneratingInvestments
      );

      let dailyProfit = 0;
      let balanceReinvested = 0;

      if (totalActiveAmount > 0) {
        const dailyRate = this.getPercentage(totalActiveAmount);
        dailyProfit = this.calculateProfit(totalActiveAmount, dailyRate);
        availableBalance += dailyProfit;
      }

      if (availableBalance >= 1) {
        balanceReinvested = availableBalance;
        createInvestment(currentDate, balanceReinvested);
      }

      const currentActiveInvestments = this.getActiveInvestments(
        simulatedInvestments,
        currentDate,
        false
      );
      const activeInvestments = this.sumTransactions(currentActiveInvestments);

      timeline.push({
        date: startOfDay(currentDate),
        balanceReinvested,
        totalInvested,
        activeInvestments,
        currentDailyProfit: dailyProfit,
      });

      currentDate.setDate(currentDate.getDate() + 1);
      startOfDay(currentDate);
    }

    const finalState = this.calculateTp(
      targetDate,
      simulatedInvestments,
      simulatedWithdrawals
    );

    const { date: allInvestmentsExpireDate, result: expiredState } =
      this.calculateExpiredState(
        targetDate,
        simulatedInvestments,
        simulatedWithdrawals
      );

    return {
      initialState,
      finalState,
      timeline,
      totalGrowth: finalState.totalInvested - initialState.totalInvested,
      simulationDays: timeline.length,
      allInvestmentsExpireDate,
      expiredState,
      totalWithdrawableAfterExpiry: expiredState.totalBalance,
      finalTotalProfits: expiredState.totalProfits,
      totalReturn: expiredState.totalBalance + expiredState.totalWithdrawn,
    };
  }
}
