import { Schema, model, models } from "mongoose";

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
});

const AnnexC = models.AnnexC || model("AnnexC", AnnexCSchema);

export default AnnexC;
