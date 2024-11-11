import { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  signatureUrl: {
    type: String,
    required: true,
  },
});

const AnnexHSchema = new Schema(
  {
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
    submissionDate: {
      type: Date,
    },
    president: SignatureSchema,
    vicePresident: SignatureSchema,
    secretary: SignatureSchema,
    treasurer: SignatureSchema,
    auditor: SignatureSchema,
    pro: SignatureSchema,
    adviser: SignatureSchema,
  },
  {
    timestamps: true,
  }
);

const AnnexH = models.AnnexH || model("AnnexH", AnnexHSchema);

export default AnnexH;
