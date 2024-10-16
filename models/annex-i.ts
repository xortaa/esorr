import { Schema, model, models } from "mongoose";

const AnnexISchema = new Schema({
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

const AnnexI = models.AnnexI || model("AnnexI", AnnexISchema);

export default AnnexI;
