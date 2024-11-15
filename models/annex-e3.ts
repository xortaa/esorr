import { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema({
  name: String,
  position: String,
  signatureUrl: String,
  dateSigned: Date,
});

const AnnexE3Schema = new Schema({
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
  pasoc: {
    type: Schema.Types.ObjectId,
    ref: "Pasoc",
  },
  secretary: SignatureSchema,
  president: SignatureSchema,
  adviser: SignatureSchema,
});

const AnnexE3 = models.AnnexE3 || model("AnnexE3", AnnexE3Schema);

export default AnnexE3;
