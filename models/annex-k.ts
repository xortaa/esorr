import { Schema, model, models } from "mongoose";

const AnnexKSchema = new Schema({
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

const AnnexK = models.AnnexK || model("AnnexK", AnnexKSchema);

export default AnnexK;
