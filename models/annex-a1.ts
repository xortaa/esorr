import { Schema, model, models } from "mongoose";

const AnnexA1Schema = new Schema({
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

const AnnexA1 = models.AnnexA1 || model("AnnexA1", AnnexA1Schema);

export default AnnexA1;
