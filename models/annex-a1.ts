// C:\Users\kercw\code\dev\esorr\models\annex-a1.ts
import { Schema, model, models } from "mongoose";

const AnnexA1Schema = new Schema({
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
  officers: {
    type: [Schema.Types.ObjectId],
    ref: "Officer",
    default: [],
  },
});

const AnnexA1 = models.AnnexA1 || model("AnnexA1", AnnexA1Schema);

export default AnnexA1;
