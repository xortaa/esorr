import { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema({
  name: {
    type: String,
  },
  position: {
    type: String,
  },
  signatureUrl: {
    type: String,
  },
});

const AnnexLSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  academicYear: {
    type: String,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
  submissionDate: {
    type: Date,
  },
  officerInCharge: {
    type: SignatureSchema,
  },
  secretary: {
    type: SignatureSchema,
  },
  president: {
    type: SignatureSchema,
  },
  adviser: {
    type: SignatureSchema,
  },
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

const AnnexL = models.AnnexL || model("AnnexL", AnnexLSchema);

export default AnnexL;
