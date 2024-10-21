import { Schema, model, models } from "mongoose";

const AnnexC1Schema = new Schema({
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

const AnnexC1 = models.AnnexC1 || model("AnnexC1", AnnexC1Schema);

export default AnnexC1;
