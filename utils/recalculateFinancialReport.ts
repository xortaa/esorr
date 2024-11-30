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
  // Preserve the original starting balance
  const originalStartingBalance = financialReport.startingBalance;

  let currentBalance = originalStartingBalance;
  let totalIncome = 0;
  let totalExpenses = 0;

  // Sort transactions by date
  financialReport.transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Reset all month data
  monthNames.forEach((month) => {
    financialReport[month] = {
      startingBalance: 0,
      endingBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
    };
  });

  // Set August's starting balance
  financialReport.august.startingBalance = originalStartingBalance;

  // Process each transaction
  financialReport.transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const monthIndex = (transactionDate.getMonth() + 5) % 12; // Adjust for fiscal year starting in August
    const monthName = monthNames[monthIndex];

    // Skip the initial balance transaction for August
    if (transaction.category === "Organization Fund / Beginning Balance") {
      return;
    }

    if (transaction.type === "inflow") {
      financialReport[monthName].totalIncome += transaction.amount;
      totalIncome += transaction.amount;
      currentBalance += transaction.amount;
    } else {
      financialReport[monthName].totalExpenses += transaction.amount;
      totalExpenses += transaction.amount;
      currentBalance -= transaction.amount;
    }

    // Update the ending balance for the current month
    financialReport[monthName].endingBalance = currentBalance;
  });

  // Calculate balances for each month
  let previousBalance = originalStartingBalance;

  monthNames.forEach((month) => {
    financialReport[month].startingBalance = previousBalance;
    financialReport[month].endingBalance =
      financialReport[month].startingBalance +
      financialReport[month].totalIncome -
      financialReport[month].totalExpenses;
    previousBalance = financialReport[month].endingBalance;
  });

  // Update total values
  financialReport.totalIncome = totalIncome;
  financialReport.totalExpenses = totalExpenses;
  financialReport.endingBalance = currentBalance;

  return financialReport;
}
