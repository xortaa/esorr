import { Schema, model, models } from "mongoose";

const MonthlyReportSchema = new Schema({
  inflow: {
    type: [Schema.Types.ObjectId],
    ref: "Inflow",
  },
  outflow: {
    type: [Schema.Types.ObjectId],
    ref: "Outflow",
  },
  balance: Number,
  totalExpenses: Number,
  totalIncome: Number,
  startingBalance: Number,
});

const FinancialReportSchema = new Schema({
  annexE1: {
    type: Schema.Types.ObjectId,
    ref: "AnnexE1",
  },
  june: MonthlyReportSchema,
  july: MonthlyReportSchema,
  august: MonthlyReportSchema,
  september: MonthlyReportSchema,
  october: MonthlyReportSchema,
  november: MonthlyReportSchema,
  december: MonthlyReportSchema,
  january: MonthlyReportSchema,
  february: MonthlyReportSchema,
  march: MonthlyReportSchema,
  april: MonthlyReportSchema,
  may: MonthlyReportSchema,
  totalIncome: {
    type: Number,
    default: 0,
  },
  totalExpenses: {
    type: Number,
    default: 0,
  },
  balance: Number,
});

const FinancialReport = models.FinancialReport || model("FinancialReport", FinancialReportSchema);

export default FinancialReport;
