import { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema({
  name: String,
  position: String,
  signatureUrl: String,
});

const MonthlyReportSchema = new Schema({
  inflows: [
    {
      type: Schema.Types.ObjectId,
      ref: "Inflow",
    },
  ],
  outflows: [
    {
      type: Schema.Types.ObjectId,
      ref: "Outflow",
    },
  ],
  treasurer: SignatureSchema,
  auditor: SignatureSchema,
  president: SignatureSchema,
  soccCorporateTreasurer: SignatureSchema,
  soccVPAuditAndLogistics: SignatureSchema,
  adviser: SignatureSchema,
  coAdviser: SignatureSchema,
  swdCoordinator: SignatureSchema,
  dean: SignatureSchema,
  regent: SignatureSchema,
  totalInflow: {
    type: Number,
    default: 0,
  },
  totalOutflow: {
    type: Number,
    default: 0,
  },
  startingBalance: {
    type: Number,
    default: 0,
  },
  endingBalance: {
    type: Number,
    default: 0,
  },
});

const AnnexE2Schema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
  january: MonthlyReportSchema,
  february: MonthlyReportSchema,
  march: MonthlyReportSchema,
  april: MonthlyReportSchema,
  may: MonthlyReportSchema,
  june: MonthlyReportSchema,
  july: MonthlyReportSchema,
  august: MonthlyReportSchema,
  september: MonthlyReportSchema,
  october: MonthlyReportSchema,
  november: MonthlyReportSchema,
  december: MonthlyReportSchema,
});

AnnexE2Schema.index({ organization: 1, academicYear: 1, month: 1 }, { unique: true });

const AnnexE2 = models.AnnexE2 || model("AnnexE2", AnnexE2Schema);

export default AnnexE2;
