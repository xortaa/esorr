import { Schema, model, models } from "mongoose";

const AnnexE3Schema = new Schema({
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

const AnnexE3 = models.AnnexE3 || model("AnnexE3", AnnexE3Schema);

export default AnnexE3;
