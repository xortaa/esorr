const monthNames = [
  "august",
  "september",
  "october",
  "november",
  "december",
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
];

export function recalculateFinancialReport(financialReport) {
  let currentBalance = financialReport.startingBalance;
  let totalIncome = 0;
  let totalExpenses = 0;

  // Sort transactions by date
  financialReport.transactions.sort((a, b) => a.date - b.date);

  // Store August's starting balance
  const augustStartingBalance = financialReport.august?.startingBalance;

  // Reset all month data
  monthNames.forEach((month) => {
    if (month === "august") {
      // Preserve August's data structure but only reset the calculated values
      financialReport[month] = {
        startingBalance: augustStartingBalance, // Keep original starting balance
        endingBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
      };
    } else {
      financialReport[month] = {
        startingBalance: 0,
        endingBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
      };
    }
  });

  // Process each transaction
  financialReport.transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const monthIndex = (transactionDate.getMonth() + 5) % 12; // Adjust for fiscal year starting in August
    const monthName = monthNames[monthIndex];

    if (transaction.type === "inflow") {
      financialReport[monthName].totalIncome += transaction.amount;
      totalIncome += transaction.amount;
      currentBalance += transaction.amount;
    } else {
      financialReport[monthName].totalExpenses += transaction.amount;
      totalExpenses += transaction.amount;
      currentBalance -= transaction.amount;
    }
  });

  // Calculate balances for each month
  let previousBalance = augustStartingBalance; // Start with August's preserved balance

  monthNames.forEach((month) => {
    if (month === "august") {
      // For August, just calculate the ending balance without modifying starting balance
      financialReport[month].endingBalance =
        augustStartingBalance + financialReport[month].totalIncome - financialReport[month].totalExpenses;
    } else {
      // For all other months, set starting balance to previous month's ending balance
      financialReport[month].startingBalance = previousBalance;
      financialReport[month].endingBalance =
        financialReport[month].startingBalance +
        financialReport[month].totalIncome -
        financialReport[month].totalExpenses;
    }
    previousBalance = financialReport[month].endingBalance;
  });

  // Update total values
  financialReport.totalIncome = totalIncome;
  financialReport.totalExpenses = totalExpenses;
  financialReport.endingBalance = currentBalance;

  return financialReport;
}

// Test the function
const testReport = {
  startingBalance: 1000,
  transactions: [
    { date: new Date("2023-08-15"), type: "inflow", amount: 500 },
    { date: new Date("2023-09-01"), type: "outflow", amount: 200 },
  ],
  august: {
    startingBalance: 1000,
    endingBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
  },
};

console.log("Initial August starting balance:", testReport.august.startingBalance);
const result = recalculateFinancialReport(testReport);
console.log("Final August starting balance:", result.august.startingBalance);
console.log("August ending balance:", result.august.endingBalance);
console.log("September starting balance:", result.september.startingBalance);
