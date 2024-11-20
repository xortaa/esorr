import { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema({
  name: String,
  position: String,
  signatureUrl: String,
  dateSigned: Date,
});

const AnnexGSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  academicYear: {
    type: String,
    required: true,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
  nominees: {
    type: [Schema.Types.ObjectId],
    ref: "Nominee",
  },
  presidentSignature: SignatureSchema,
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
});

const AnnexG = models.AnnexG || model("AnnexG", AnnexGSchema);

export default AnnexG;
