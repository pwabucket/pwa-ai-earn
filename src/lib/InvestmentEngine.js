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
   * Converts date to YYYY-MM-DD string format
   * @param {Date} date - Date to convert
   * @returns {string} Date string in YYYY-MM-DD format
   */
  static getDateString(date) {
    return date.toISOString().split("T")[0];
  }

  /**
   * Calculates days between two dates
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {number} Number of days between dates
   */
  static getDaysDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
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
    const investmentStart = new Date(investment.date);
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
      const dateKey = this.getDateString(new Date(investment.date));
      if (!eventGroups.has(dateKey)) {
        eventGroups.set(dateKey, {
          date: new Date(investment.date),
          investments: [],
          withdrawals: [],
        });
      }
      eventGroups.get(dateKey).investments.push(investment);
    });

    withdrawals.forEach((withdrawal) => {
      const dateKey = this.getDateString(new Date(withdrawal.date));
      if (!eventGroups.has(dateKey)) {
        eventGroups.set(dateKey, {
          date: new Date(withdrawal.date),
          investments: [],
          withdrawals: [],
        });
      }
      eventGroups.get(dateKey).withdrawals.push(withdrawal);
    });

    return Array.from(eventGroups.values()).sort((a, b) => a.date - b.date);
  }

  /**
   * Calculates total portfolio metrics for a given date
   * @param {Date} selectedDate - Date to calculate metrics for
   * @param {Array} investments - Array of investment objects
   * @param {Array} withdrawals - Array of withdrawal objects
   * @returns {Object} Portfolio metrics including balance, profits, and active investments
   */
  static calculateTp(selectedDate, investments, withdrawals) {
    const priorInvestments = investments.filter(
      (investment) => new Date(investment.date) <= new Date(selectedDate)
    );

    const priorWithdrawals = withdrawals.filter(
      (withdrawal) => new Date(withdrawal.date) <= new Date(selectedDate)
    );

    if (priorInvestments.length === 0) {
      return {
        totalBalance: 0,
        totalProfits: 0,
        totalInvested: 0,
        totalWithdrawn: 0,
        activeInvestments: 0,
        currentDailyProfit: 0,
        currentDailyRate: 0,
        todaysProfit: 0,
        currentActiveInvestments: [],
      };
    }

    const earliestDate = new Date(
      Math.min(...priorInvestments.map((inv) => new Date(inv.date)))
    );
    const endDate = new Date(selectedDate);

    let availableBalance = 0;
    let totalProfits = 0;
    let totalInvested = priorInvestments.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    let totalWithdrawn = priorWithdrawals.reduce(
      (sum, withdrawal) => sum + withdrawal.amount,
      0
    );

    const withdrawalsByDate = new Map();
    priorWithdrawals.forEach((withdrawal) => {
      const dateKey = this.getDateString(new Date(withdrawal.date));
      if (!withdrawalsByDate.has(dateKey)) {
        withdrawalsByDate.set(dateKey, 0);
      }
      withdrawalsByDate.set(
        dateKey,
        withdrawalsByDate.get(dateKey) + withdrawal.amount
      );
    });

    const currentDate = new Date(earliestDate);
    while (currentDate <= endDate) {
      const currentDateString = this.getDateString(currentDate);

      const profitGeneratingInvestments = this.getActiveInvestments(
        priorInvestments,
        currentDate,
        true
      );

      const totalActiveAmount = profitGeneratingInvestments.reduce(
        (sum, inv) => sum + inv.amount,
        0
      );

      let dailyProfit = 0;
      if (totalActiveAmount > 0) {
        const dailyRate = this.getPercentage(totalActiveAmount);
        dailyProfit = totalActiveAmount * dailyRate;
        totalProfits += dailyProfit;
        availableBalance += dailyProfit;
      }

      const todayWithdrawals = withdrawalsByDate.get(currentDateString) || 0;

      if (todayWithdrawals > 0) {
        availableBalance -= todayWithdrawals;
        if (availableBalance < 0) {
          availableBalance = 0;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const currentActiveInvestments = this.getActiveInvestments(
      priorInvestments,
      endDate,
      false
    );
    const totalActiveAmount = currentActiveInvestments.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );

    const currentDailyRate =
      totalActiveAmount > 0 ? this.getPercentage(totalActiveAmount) : 0;
    const currentDailyProfit = totalActiveAmount * currentDailyRate;

    // Calculate today's profit (profit earned on the selected date)
    const todaysProfitGeneratingInvestments = this.getActiveInvestments(
      priorInvestments,
      endDate,
      true
    );
    const todaysProfitAmount = todaysProfitGeneratingInvestments.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    const todaysProfitRate =
      todaysProfitAmount > 0 ? this.getPercentage(todaysProfitAmount) : 0;
    const todaysProfit = todaysProfitAmount * todaysProfitRate;

    return {
      totalBalance: availableBalance,
      totalProfits,
      totalInvested,
      totalWithdrawn,
      activeInvestments: totalActiveAmount,
      currentDailyProfit,
      currentDailyRate,
      todaysProfit,
      currentActiveInvestments,
    };
  }
}
