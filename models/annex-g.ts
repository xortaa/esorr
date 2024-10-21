import { Schema, model, models } from "mongoose";

const AnnexGSchema = new Schema({
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
});

const AnnexG = models.AnnexG || model("AnnexG", AnnexGSchema);

export default AnnexG;
