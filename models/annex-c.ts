import { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema({
  name: String,
  position: String,
  signatureUrl: String,
  dateSigned: Date,
});

const AnnexCSchema = new Schema({
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
  ratificationDate: {
    type: Date,
  },
  ratificationVenue: {
    type: String,
  },
  secretaryRatificationVenue: {
    type: String,
  },
  secretary: SignatureSchema,
  president: SignatureSchema,
  swdCoordinator: SignatureSchema,
  soccDirector: SignatureSchema,
});

const AnnexC = models.AnnexC || model("AnnexC", AnnexCSchema);

export default AnnexC;