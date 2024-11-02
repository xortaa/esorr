import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  date: { type: Date },
  amount: { type: Number },
  type: { type: String, enum: ["inflow", "outflow"] },
  category: { type: String },
  description: String,
});

const monthDataSchema = new mongoose.Schema({
  startingBalance: { type: Number, default: 0 },
  endingBalance: { type: Number, default: 0 },
  totalIncome: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
});

const financialReportSchema = new mongoose.Schema({
  annexE1: { type: mongoose.Schema.Types.ObjectId, ref: "AnnexE1" },
  academicYear: { type: String },
  startingBalance: { type: Number },
  transactions: [transactionSchema],
  june: monthDataSchema,
  july: monthDataSchema,
  august: monthDataSchema,
  september: monthDataSchema,
  october: monthDataSchema,
  november: monthDataSchema,
  december: monthDataSchema,
  january: monthDataSchema,
  february: monthDataSchema,
  march: monthDataSchema,
  april: monthDataSchema,
  may: monthDataSchema,
  totalIncome: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  endingBalance: { type: Number, default: 0 },
});

const FinancialReport = mongoose.models.FinancialReport || mongoose.model("FinancialReport", financialReportSchema);

export default FinancialReport;
