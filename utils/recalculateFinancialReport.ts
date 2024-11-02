const monthNames = [
  "june",
  "july",
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
];

export function recalculateFinancialReport(financialReport) {
  let currentBalance = financialReport.startingBalance;
  let totalIncome = 0;
  let totalExpenses = 0;

  // Sort transactions by date
  financialReport.transactions.sort((a, b) => a.date - b.date);

  // Reset all month data
  monthNames.forEach((month) => {
    financialReport[month] = {
      startingBalance: 0,
      endingBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
    };
  });

  // Process each transaction
  financialReport.transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const monthIndex = (transactionDate.getMonth() + 7) % 12; // Adjust for fiscal year starting in June
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
  let previousBalance = financialReport.startingBalance;
  monthNames.forEach((month) => {
    financialReport[month].startingBalance = previousBalance;
    financialReport[month].endingBalance =
      previousBalance + financialReport[month].totalIncome - financialReport[month].totalExpenses;
    previousBalance = financialReport[month].endingBalance;
  });

  // Update total values
  financialReport.totalIncome = totalIncome;
  financialReport.totalExpenses = totalExpenses;
  financialReport.endingBalance = currentBalance;

  return financialReport;
}
