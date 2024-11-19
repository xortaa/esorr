import { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema({
  name: String,
  position: String,
  signatureUrl: String,
});

const AnnexESchema = new Schema({
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
  operationalAssessment: {
    type: Schema.Types.ObjectId,
    ref: "OperationalAssessment",
  },
  outgoingSecretary: SignatureSchema,
  outgoingPresident: SignatureSchema,
  incomingSecretary: SignatureSchema,
  incomingPresident: SignatureSchema,
  adviser: SignatureSchema,
});

const AnnexE = models.AnnexE || model("AnnexE", AnnexESchema);

export default AnnexE;
