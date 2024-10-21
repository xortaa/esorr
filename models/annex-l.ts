import { Schema, model, models } from "mongoose";

const AnnexLSchema = new Schema({
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

const AnnexL = models.AnnexL || model("AnnexL", AnnexLSchema);

export default AnnexL;
