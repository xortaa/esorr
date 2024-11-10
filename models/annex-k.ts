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

const AnnexKSchema = new Schema(
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
    greenMarshall: SignatureSchema,
    secretary: SignatureSchema,
    president: SignatureSchema,
    adviser: SignatureSchema,
  },
  {
    timestamps: true,
  }
);

const AnnexK = models.AnnexK || model("AnnexK", AnnexKSchema);

export default AnnexK;
