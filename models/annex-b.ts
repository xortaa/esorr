import { Schema, model, models } from "mongoose";

const AnnexBSchema = new Schema({
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
  members: {
    type: [Schema.Types.ObjectId],
    ref: "Member",
    default: [],
  }
});

const AnnexB = models.AnnexB || model("AnnexB", AnnexBSchema);

export default AnnexB;
