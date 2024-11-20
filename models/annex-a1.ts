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
  officers: {
    type: [Schema.Types.ObjectId],
    ref: "Officer",
    default: [],
  },
  status: {
    type: String,
    enum: ["Not Submitted", "Rejected", "For Review", "Approved"],
    default: "Not Submitted",
  },
  soccRemarks: {
    type: String,
    default: "",
  },
  osaRemarks: {
    type: String,
    default: "",
  },
  dateSubmitted: Date,
});

const AnnexA1 = models.AnnexA1 || model("AnnexA1", AnnexA1Schema);

export default AnnexA1;
