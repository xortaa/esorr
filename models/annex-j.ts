import { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  signatureUrl: {
    type: String,
    required: true,
  },
});

const AnnexJSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  president: SignatureSchema,
  vicePresident: SignatureSchema,
  secretary: SignatureSchema,
  treasurer: SignatureSchema,
  auditor: SignatureSchema,
  pro: SignatureSchema,
  adviser: SignatureSchema,
  status: {
    type: String,
    enum: ["Not Submitted", "Rejected", "For Review", "Approved"],
    default: "Not Submitted",
  },
  soccRemarks: {
    type: String,
    default: "",
  },
  osaRemarks: {
    type: String,
    default: "",
  },
  dateSubmitted: Date,
  osaOfficerInCharge: String,
});

const AnnexJ = models.AnnexJ || model("AnnexJ", AnnexJSchema);

export default AnnexJ;
