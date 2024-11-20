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

const AnnexFSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  academicYear: {
    type: String,
    required: true,
  },
  activities: {
    type: [Schema.Types.ObjectId],
    ref: "Activity",
  },
  outgoingPresident: SignatureSchema,
  incomingPresident: SignatureSchema,
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
});

const AnnexF = models.AnnexF || model("AnnexF", AnnexFSchema);

export default AnnexF;
