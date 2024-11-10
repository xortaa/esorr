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
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

const AnnexL = models.AnnexL || model("AnnexL", AnnexLSchema);

export default AnnexL;
