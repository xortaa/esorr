import { Schema, model, models } from "mongoose";

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
});

const AnnexE1 = models.AnnexE1 || model("AnnexE1", AnnexE1Schema);

export default AnnexE1;
