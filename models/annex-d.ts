import { Schema, model, models } from "mongoose";

const AnnexDSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  logo: {
    type: String,
  },
  description: {
    type: String,
  },
  academicYear: {
    type: String,
    required: true,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
});

const AnnexD = models.AnnexD || model("AnnexD", AnnexDSchema);

export default AnnexD;
