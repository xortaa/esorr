import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
  date: Date,
  amount: Number,
  type: { type: String, enum: ["inflow", "outflow"] },
  category: String,
  description: String,
  establishment: String,
  items: [
    {
      category: String,
      description: String,
      cost: Number,
      quantity: Number,
      serialNumber: String,
    },
  ],
  payingParticipants: Number,
  totalMembers: Number,
  merchandiseSales: Number,
});

const MonthDataSchema = new Schema({
  startingBalance: Number,
  endingBalance: Number,
  totalIncome: Number,
  totalExpenses: Number,
});

const FinancialReportSchema = new Schema({
  annexE1: { type: Schema.Types.ObjectId, ref: "AnnexE1" },
  academicYear: String,
  startingBalance: Number,
  transactions: [TransactionSchema],
  august: MonthDataSchema,
  september: MonthDataSchema,
  october: MonthDataSchema,
  november: MonthDataSchema,
  december: MonthDataSchema,
  january: MonthDataSchema,
  february: MonthDataSchema,
  march: MonthDataSchema,
  april: MonthDataSchema,
  may: MonthDataSchema,
  june: MonthDataSchema,
  july: MonthDataSchema,
  totalIncome: Number,
  totalExpenses: Number,
  endingBalance: Number,
});

const FinancialReport = models.FinancialReport || model("FinancialReport", FinancialReportSchema);

export default FinancialReport;
