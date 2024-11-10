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

const AnnexISchema = new Schema(
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
    secretary: SignatureSchema,
    pro: SignatureSchema,
    adviser: SignatureSchema,
  },
  {
    timestamps: true,
  }
);

const AnnexI = models.AnnexI || model("AnnexI", AnnexISchema);

export default AnnexI;
