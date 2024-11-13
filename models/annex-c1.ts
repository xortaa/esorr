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

const AnnexC1Schema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
  articlesOfAssociation: {
    type: Schema.Types.ObjectId,
    ref: "ArticlesOfAssociation",
    default: null,
  },
  pdf: {
    type: String,
    default: null,
  },
  president: {
    type: SignatureSchema,
  },
  vicePresident: {
    type: SignatureSchema,
  },
  secretary: {
    type: SignatureSchema,
  },
  treasurer: {
    type: SignatureSchema,
  },
  auditor: {
    type: SignatureSchema,
  },
  peaceRelationsOfficer: {
    type: SignatureSchema,
  },
  adviser: {
    type: SignatureSchema,
  },
  comelecRepresentative: {
    type: SignatureSchema,
  },
  dateSubmitted: {
    type: Date,
  },
});

// Remove any existing index on articlesOfAssociation
AnnexC1Schema.index({ articlesOfAssociation: 1 }, { unique: false, sparse: true });

const AnnexC1 = models.AnnexC1 || model("AnnexC1", AnnexC1Schema);

export default AnnexC1;
