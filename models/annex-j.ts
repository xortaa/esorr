import { Schema, model, models } from "mongoose";

const AnnexJSchema = new Schema({
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

const AnnexJ = models.AnnexJ || model("AnnexJ", AnnexJSchema);

export default AnnexJ;
