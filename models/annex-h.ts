import { Schema, model, models } from "mongoose";

const AnnexHSchema = new Schema({
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

const AnnexH = models.AnnexH || model("AnnexH", AnnexHSchema);

export default AnnexH;
