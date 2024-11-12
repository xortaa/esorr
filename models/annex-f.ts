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
  isSubmitted: {
    type: Boolean,
    default: false,
  },
  activities: {
    type: [Schema.Types.ObjectId],
    ref: "Activity",
  },
  outgoingPresident: SignatureSchema,
  incomingPresident: SignatureSchema,
  adviser: SignatureSchema,
});

const AnnexF = models.AnnexF || model("AnnexF", AnnexFSchema);

export default AnnexF;
