import { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema({
  name: String,
  position: String,
  signatureUrl: String,
  dateSigned: Date,
});


const AnnexE1Schema = new Schema({
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
  financialReport: { 
    type: Schema.Types.ObjectId,
    ref: "FinancialReport",
  },
  treasurer: SignatureSchema,
  president: SignatureSchema,
  soccCorporateTreasurer: SignatureSchema,
  adviser: SignatureSchema,
  swdCoordinator: SignatureSchema,
  dean: SignatureSchema,
});

const AnnexE1 = models.AnnexE1 || model("AnnexE1", AnnexE1Schema);

export default AnnexE1;
