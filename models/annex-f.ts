import { Schema, model, models } from "mongoose";

const AnnexFSchema = new Schema({
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
  activities: {
    type: [Schema.Types.ObjectId],
    ref: "Activity",
  }
});

const AnnexF = models.AnnexF || model("AnnexF", AnnexFSchema);

export default AnnexF;
